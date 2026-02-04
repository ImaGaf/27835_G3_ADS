import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CreditCard, DollarSign, FileText, Download, Building2, Banknote } from 'lucide-react';
import { paymentService } from '@/lib/payments.backend';
import { creditService } from '@/lib/credits.backend';
import { useToast } from '@/hooks/use-toast';

export const PaymentHistory = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'late' | 'pending'>('all');

  const [payments, setPayments] = useState<any[]>([]);
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('accessToken');
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      const [paymentsData, creditsData] = await Promise.all([
        paymentService.getMyPayments(token),
        creditService.getClientCredits(token)
      ]);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      const enrichedCredits = Array.isArray(creditsData) ? creditsData.map((credit: any) => {
        const creditPayments = Array.isArray(paymentsData) ? paymentsData.filter((p: any) => p.creditId === credit.id && p.status?.toLowerCase() === 'paid') : [];
        const monthlyPayment = credit.term ? credit.amount / credit.term : credit.amount;
        const paidTotal = creditPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        return {
          ...credit,
          monthlyPayment,
          remainingBalance: Math.max(0, credit.amount - paidTotal),
          status: credit.status?.toLowerCase()
        };
      }) : [];
      setCredits(enrichedCredits);
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredPayments = filterStatus === 'all'
    ? payments
    : payments.filter(payment => payment.status === filterStatus);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(d);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-100 text-green-800 border-green-200',
      late: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    const labels = {
      paid: 'Pagado',
      late: 'Atrasado',
      pending: 'Pendiente'
    };

    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'transfer':
        return <span className="flex items-center gap-1"><Building2 className="h-4 w-4 text-green-600" /> Transferencia</span>;
      case 'cash':
        return <span className="flex items-center gap-1"><Banknote className="h-4 w-4 text-green-600" /> Efectivo</span>;
      case 'check':
        return <span className="flex items-center gap-1"><FileText className="h-4 w-4 text-green-600" /> Cheque</span>;
      default:
        return <span>{method}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Resumen de Créditos Activos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {credits.map((credit, index) => (
          <Card key={credit.id} className={`border-green-200 hover:shadow-lg transition-all duration-300 animate-slide-in`} style={{ animationDelay: `${index * 150}ms` }}>
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
              <CardTitle className="text-green-800 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Crédito {credit.id}
              </CardTitle>
              <CardDescription className="text-green-600">
                {credit.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Monto Original</p>
                  <p className="text-lg font-semibold text-green-700">{formatCurrency(credit.amount)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Saldo Pendiente</p>
                  <p className="text-lg font-semibold text-red-600">{formatCurrency(credit.remainingBalance)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Cuota Mensual</p>
                  <p className="text-md font-medium text-gray-800">{formatCurrency(credit.monthlyPayment)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Tasa de Interés</p>
                  <p className="text-md font-medium text-gray-800">{credit.interestRate}% anual</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Badge className={credit.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {credit.status === 'active' ? 'Activo' : 'Completado'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Historial de Pagos */}
      <Card className="border-green-200 animate-slide-in animation-delay-300">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Historial de Pagos
              </CardTitle>
              <CardDescription className="text-green-600">
                Registro completo de sus pagos realizados
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? 'bg-green-100 border-green-300' : ''}
              >
                Todos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterStatus('paid')}
                className={filterStatus === 'paid' ? 'bg-green-100 border-green-300' : ''}
              >
                Pagados
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterStatus('late')}
                className={filterStatus === 'late' ? 'bg-red-100 border-red-300' : ''}
              >
                Atrasados
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-50">
                  <TableHead className="text-green-800">Fecha de Pago</TableHead>
                  <TableHead className="text-green-800">Crédito</TableHead>
                  <TableHead className="text-green-800">Monto</TableHead>
                  <TableHead className="text-green-800">Método</TableHead>
                  <TableHead className="text-green-800">Estado</TableHead>
                  <TableHead className="text-green-800">Descripción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment, index) => (
                  <TableRow 
                    key={payment.id} 
                    className={`hover:bg-green-50 transition-colors duration-200 animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        {formatDate(payment.paidDate || payment.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        {payment.creditId}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-700">{formatCurrency(payment.amount)}</span>
                        </div>
                        {payment.interestAmount && (
                          <div className="text-xs text-gray-500">
                            Capital: {formatCurrency(payment.principalAmount)} | 
                            Interés: {formatCurrency(payment.interestAmount)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.status)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {payment.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron pagos con el filtro seleccionado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      <div className="flex gap-4 justify-end animate-slide-in animation-delay-600">
        <Button variant="outline" className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50" onClick={() => toast({ title: "Exportar PDF", description: "Esta funcionalidad está en desarrollo", variant: "default" })}>
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>
        <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700" onClick={() => toast({ title: "Estado de Cuenta", description: "Esta funcionalidad está en desarrollo", variant: "default" })}>
          <FileText className="h-4 w-4" />
          Solicitar Estado de Cuenta
        </Button>
      </div>
    </div>
  );
};
