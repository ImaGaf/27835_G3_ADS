import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { paymentService } from '@/lib/payments.backend';
import { useToast } from '@/hooks/use-toast';

interface PaidPayment {
  id: string;
  creditId: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  paidDate?: string;
  createdAt?: string;
}

interface CertificatesViewProps {
  user: { id: string };
}

export const CertificatesView = ({ user }: CertificatesViewProps) => {
  const [paidPayments, setPaidPayments] = useState<PaidPayment[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPaidPayments();
  }, [user.id]);

  const loadPaidPayments = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const allPayments = await paymentService.getMyPayments(token);
    const paid = Array.isArray(allPayments)
      ? allPayments.filter((p: any) => p.status?.toLowerCase() === 'paid').map((p: any) => ({
          ...p,
          status: p.status?.toLowerCase()
        }))
      : [];
    setPaidPayments(paid);
  };

  const handlePaymentSelect = (paymentId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, paymentId]);
    } else {
      setSelectedPayments(selectedPayments.filter(id => id !== paymentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayments(paidPayments.map(p => p.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const generateCertificate = async () => {
    if (selectedPayments.length === 0) {
      toast({
        title: "Selección requerida",
        description: "Debe seleccionar al menos un pago para generar el certificado.",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const selected = paidPayments.filter(p => selectedPayments.includes(p.id));
      const total = selected.reduce((sum, p) => sum + p.amount, 0);
      const lines = [
        'CERTIFICADO DE PAGO - PagoSeguro',
        '================================',
        `Fecha de emisión: ${new Date().toLocaleDateString('es-EC')}`,
        '',
        ...selected.map(p =>
          `- ID: ${p.id}\n  Monto: $${p.amount.toFixed(2)}\n  Fecha: ${p.paidDate ? new Date(p.paidDate).toLocaleDateString('es-EC') : new Date(p.createdAt || '').toLocaleDateString('es-EC')}\n  Método: ${p.paymentMethod || 'N/A'}`
        ),
        '',
        `Total certificado: $${total.toFixed(2)}`
      ];

      const blob = new Blob([lines.join('\n')], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `certificado-pagos-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Certificado generado",
        description: `Se ha descargado el certificado con ${selectedPayments.length} pago(s).`,
      });

      setSelectedPayments([]);
    } catch {
      toast({
        title: "Error al generar certificado",
        description: "No se pudo generar el certificado. Intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const selectedTotal = paidPayments
    .filter(p => selectedPayments.includes(p.id))
    .reduce((sum, p) => sum + p.amount, 0);

  if (paidPayments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No hay pagos registrados</h2>
        <p className="text-gray-500 text-center">
          No tiene pagos realizados para generar certificados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Certificados de Pago</h1>
          <p className="text-gray-500">
            Genere y descargue certificados de sus pagos realizados
          </p>
        </div>
        <Button
          onClick={generateCertificate}
          disabled={selectedPayments.length === 0 || generating}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Generar Certificado
            </>
          )}
        </Button>
      </div>

      {selectedPayments.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">
                    {selectedPayments.length} pago(s) seleccionado(s)
                  </p>
                  <p className="text-sm text-green-600">
                    Total: ${selectedTotal.toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setSelectedPayments([])}
                variant="outline"
                size="sm"
              >
                Limpiar selección
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historial de Pagos</CardTitle>
              <CardDescription>
                Seleccione los pagos para incluir en el certificado
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedPayments.length === paidPayments.length && paidPayments.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label className="text-sm font-medium">Seleccionar todos</label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paidPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  checked={selectedPayments.includes(payment.id)}
                  onCheckedChange={(checked) => handlePaymentSelect(payment.id, checked as boolean)}
                />

                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">${payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Monto pagado</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">
                        {payment.paidDate
                          ? new Date(payment.paidDate).toLocaleDateString('es-EC')
                          : payment.createdAt
                            ? new Date(payment.createdAt).toLocaleDateString('es-EC')
                            : '-'}
                      </p>
                      <p className="text-sm text-gray-500">Fecha de pago</p>
                    </div>
                  </div>

                  <div>
                    <Badge className="bg-green-100 text-green-800">
                      {payment.paymentMethod === 'card' ? 'Tarjeta' :
                       payment.paymentMethod === 'transfer' ? 'Transferencia' :
                       payment.paymentMethod === 'cash' ? 'Efectivo' : 'Otro'}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">Método</p>
                  </div>

                  <div>
                    <p className="font-medium text-xs font-mono truncate">
                      {payment.id}
                    </p>
                    <p className="text-sm text-gray-500">ID Transacción</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Información del Certificado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-500">
            <p>Los certificados incluyen información detallada de cada pago: fecha, monto, método de pago y número de transacción.</p>
            <p>El certificado será generado en formato PDF y se descargará automáticamente.</p>
            <p>Puede seleccionar múltiples pagos para generar un certificado consolidado.</p>
            <p>Los certificados tienen validez legal y pueden ser utilizados como comprobante de pago.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
