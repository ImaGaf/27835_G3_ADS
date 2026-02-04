/**
 * Tests Unitarios - AuditService
 * RF07: Auditoría - Registro de Eventos de Seguridad
 */

import { AuditService } from '../../../src/services/AuditService';
import { IAuditLogRepository, AuditLogData, AuditStatus } from '../../../src/lib/interfaces';

// Mock del repositorio de auditoría
class MockAuditLogRepository implements IAuditLogRepository {
  public logs: AuditLogData[] = [];

  async save(log: AuditLogData): Promise<void> {
    this.logs.push(log);
  }

  async findByUserId(userId: string, limit?: number): Promise<AuditLogData[]> {
    const filtered = this.logs.filter(log => log.userId === userId);
    return limit ? filtered.slice(0, limit) : filtered;
  }

  async findByAction(action: string, limit?: number): Promise<AuditLogData[]> {
    const filtered = this.logs.filter(log => log.action === action);
    return limit ? filtered.slice(0, limit) : filtered;
  }

  async findRecent(limit?: number): Promise<AuditLogData[]> {
    return limit ? this.logs.slice(-limit) : this.logs;
  }

  clear(): void {
    this.logs = [];
  }
}

describe('AuditService', () => {
  let auditService: AuditService;
  let mockRepository: MockAuditLogRepository;

  beforeEach(() => {
    mockRepository = new MockAuditLogRepository();
    auditService = new AuditService(mockRepository);
  });

  describe('RF07.1 - Log Genérico', () => {
    test('Debe registrar entrada de log genérica', async () => {
      await auditService.log({
        userId: 'user-123',
        action: 'custom.action',
        status: 'SUCCESS',
        details: { custom: 'data' },
        ipAddress: '192.168.1.1',
        userAgent: 'TestAgent/1.0',
      });

      expect(mockRepository.logs.length).toBe(1);
      expect(mockRepository.logs[0].action).toBe('custom.action');
      expect(mockRepository.logs[0].status).toBe('SUCCESS');
    });

    test('Debe incluir módulo AUTH', async () => {
      await auditService.log({
        action: 'test.action',
        status: 'SUCCESS',
        details: {},
        ipAddress: '127.0.0.1',
        userAgent: 'Test',
      });

      expect(mockRepository.logs[0].module).toBe('AUTH');
    });

    test('Debe aceptar log con error', async () => {
      await auditService.log({
        action: 'failed.action',
        status: 'FAILURE',
        details: {},
        error: 'Error message',
        ipAddress: '127.0.0.1',
        userAgent: 'Test',
      });

      expect(mockRepository.logs[0].status).toBe('FAILURE');
    });
  });

  describe('RF07.2 - Log de Login Exitoso', () => {
    test('Debe registrar login exitoso', async () => {
      await auditService.logLoginSuccess(
        'user@example.com',
        'user-123',
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(mockRepository.logs.length).toBe(1);
      expect(mockRepository.logs[0].action).toBe('user.login');
      expect(mockRepository.logs[0].status).toBe('SUCCESS');
      expect(mockRepository.logs[0].userId).toBe('user-123');
    });

    test('Debe incluir email en detalles', async () => {
      await auditService.logLoginSuccess(
        'user@example.com',
        'user-123',
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(mockRepository.logs[0].details).toEqual({ email: 'user@example.com' });
    });

    test('Debe incluir IP y User-Agent', async () => {
      await auditService.logLoginSuccess(
        'user@example.com',
        'user-123',
        '10.0.0.1',
        'Chrome/120.0'
      );

      expect(mockRepository.logs[0].ipAddress).toBe('10.0.0.1');
      expect(mockRepository.logs[0].userAgent).toBe('Chrome/120.0');
    });
  });

  describe('RF07.3 - Log de Login Fallido', () => {
    test('Debe registrar login fallido', async () => {
      await auditService.logLoginFailure(
        'user@example.com',
        'Contraseña incorrecta',
        'user-123',
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(mockRepository.logs.length).toBe(1);
      expect(mockRepository.logs[0].action).toBe('user.login');
      expect(mockRepository.logs[0].status).toBe('FAILURE');
    });

    test('Debe usar valores por defecto si no se proporcionan', async () => {
      await auditService.logLoginFailure(
        'user@example.com',
        'Usuario no encontrado'
      );

      expect(mockRepository.logs[0].ipAddress).toBe('127.0.0.1');
      expect(mockRepository.logs[0].userAgent).toBe('unknown');
    });

    test('Debe registrar sin userId si no existe', async () => {
      await auditService.logLoginFailure(
        'nonexistent@example.com',
        'Usuario no encontrado',
        undefined,
        '192.168.1.1',
        'Test'
      );

      expect(mockRepository.logs[0].userId).toBeUndefined();
    });
  });

  describe('RF07.4 - Log de Registro', () => {
    test('Debe registrar registro exitoso', async () => {
      await auditService.logRegistration(
        'newuser@example.com',
        'user-new-123',
        'SUCCESS',
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(mockRepository.logs.length).toBe(1);
      expect(mockRepository.logs[0].action).toBe('user.register');
      expect(mockRepository.logs[0].status).toBe('SUCCESS');
      expect(mockRepository.logs[0].userId).toBe('user-new-123');
    });

    test('Debe registrar registro fallido con error', async () => {
      await auditService.logRegistration(
        'existing@example.com',
        '',
        'FAILURE',
        '192.168.1.1',
        'Mozilla/5.0',
        'Usuario ya existe'
      );

      expect(mockRepository.logs[0].status).toBe('FAILURE');
    });

    test('Debe incluir email en detalles', async () => {
      await auditService.logRegistration(
        'user@example.com',
        'user-123',
        'SUCCESS',
        '127.0.0.1',
        'Test'
      );

      expect(mockRepository.logs[0].details).toEqual({ email: 'user@example.com' });
    });
  });

  describe('RF07.5 - Log de Logout', () => {
    test('Debe registrar logout exitoso', async () => {
      await auditService.logLogout(
        'user-123',
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(mockRepository.logs.length).toBe(1);
      expect(mockRepository.logs[0].action).toBe('user.logout');
      expect(mockRepository.logs[0].status).toBe('SUCCESS');
    });

    test('Debe incluir userId en detalles', async () => {
      await auditService.logLogout(
        'user-123',
        '127.0.0.1',
        'Test'
      );

      expect(mockRepository.logs[0].details).toEqual({ userId: 'user-123' });
    });
  });

  describe('RF07.6 - Múltiples Registros', () => {
    test('Debe mantener todos los registros', async () => {
      await auditService.logLoginSuccess('user1@test.com', 'u1', '1.1.1.1', 'A1');
      await auditService.logLoginFailure('user2@test.com', 'Error', 'u2', '2.2.2.2', 'A2');
      await auditService.logRegistration('user3@test.com', 'u3', 'SUCCESS', '3.3.3.3', 'A3');
      await auditService.logLogout('u4', '4.4.4.4', 'A4');

      expect(mockRepository.logs.length).toBe(4);
    });

    test('Logs deben ser consultables por userId', async () => {
      await auditService.logLoginSuccess('user@test.com', 'user-123', '1.1.1.1', 'A1');
      await auditService.logLogout('user-123', '1.1.1.1', 'A1');
      await auditService.logLoginSuccess('other@test.com', 'other-456', '2.2.2.2', 'A2');

      const userLogs = await mockRepository.findByUserId('user-123');

      expect(userLogs.length).toBe(2);
    });

    test('Logs deben ser consultables por acción', async () => {
      await auditService.logLoginSuccess('user1@test.com', 'u1', '1.1.1.1', 'A1');
      await auditService.logLoginFailure('user2@test.com', 'Error', 'u2', '2.2.2.2', 'A2');
      await auditService.logLoginSuccess('user3@test.com', 'u3', '3.3.3.3', 'A3');

      const loginLogs = await mockRepository.findByAction('user.login');

      expect(loginLogs.length).toBe(3);
    });
  });
});
