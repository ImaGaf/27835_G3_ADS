/**
 * Tests Unitarios - UserStateService
 * RF04: Seguridad - Gestión de Estado del Usuario
 */

import { UserStateService } from '../../../src/services/UserStateService';
import { User, UserRole, UserStatus } from '../../../src/models/User';
import { Email } from '../../../src/models/Email';
import { Password } from '../../../src/models/Password';

describe('UserStateService', () => {
  const createTestUser = (overrides: Partial<{
    status: UserStatus;
    loginAttempts: number;
    blockedUntil: Date;
    lastLoginAttempt: Date;
    emailVerified: boolean;
    resetToken: string;
    resetTokenExpiry: Date;
  }> = {}): User => {
    return new User(
      'test-id-123',
      new Email('test@example.com'),
      new Password('HashedPassword123!', true),
      'Usuario de Prueba',
      UserRole.CLIENTE,
      overrides.status || UserStatus.ACTIVE,
      '1234567890',
      '0999999999',
      'Dirección de prueba',
      overrides.loginAttempts || 0,
      overrides.lastLoginAttempt,
      overrides.blockedUntil,
      undefined, // lastLogin
      overrides.emailVerified || false,
      undefined, // emailVerifiedAt
      undefined, // verificationToken
      overrides.resetToken,
      overrides.resetTokenExpiry
    );
  };

  describe('RF04.1 - Verificar Bloqueo de Cuenta', () => {
    test('Usuario ACTIVE no debe estar bloqueado', () => {
      const user = createTestUser({ status: UserStatus.ACTIVE });
      expect(UserStateService.isBlocked(user)).toBe(false);
    });

    test('Usuario BLOCKED sin fecha debe estar bloqueado indefinidamente', () => {
      const user = createTestUser({ 
        status: UserStatus.BLOCKED,
        blockedUntil: undefined 
      });
      expect(UserStateService.isBlocked(user)).toBe(false);
    });

    test('Usuario BLOCKED con fecha futura debe estar bloqueado', () => {
      const futureDate = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
      const user = createTestUser({ 
        status: UserStatus.BLOCKED,
        blockedUntil: futureDate 
      });
      expect(UserStateService.isBlocked(user)).toBe(true);
    });

    test('Usuario BLOCKED con fecha pasada debe desbloquearse', () => {
      const pastDate = new Date(Date.now() - 1000); // 1 segundo atrás
      const user = createTestUser({ 
        status: UserStatus.BLOCKED,
        blockedUntil: pastDate 
      });
      
      const isBlocked = UserStateService.isBlocked(user);
      
      expect(isBlocked).toBe(false);
      expect(user.status).toBe(UserStatus.ACTIVE);
      expect(user.loginAttempts).toBe(0);
    });
  });

  describe('RF04.2 - Incrementar Intentos de Login', () => {
    test('Debe incrementar loginAttempts en 1', () => {
      const user = createTestUser({ loginAttempts: 0 });
      
      UserStateService.incrementLoginAttempts(user);
      
      expect(user.loginAttempts).toBe(1);
    });

    test('Debe actualizar lastLoginAttempt', () => {
      const user = createTestUser();
      const antes = new Date();
      
      UserStateService.incrementLoginAttempts(user);
      
      expect(user.lastLoginAttempt).toBeDefined();
      expect(user.lastLoginAttempt!.getTime()).toBeGreaterThanOrEqual(antes.getTime());
    });

    test('Debe bloquear cuenta después de 5 intentos', () => {
      const user = createTestUser({ loginAttempts: 4 });
      
      UserStateService.incrementLoginAttempts(user);
      
      expect(user.loginAttempts).toBe(5);
      expect(user.status).toBe(UserStatus.BLOCKED);
      expect(user.blockedUntil).toBeDefined();
    });

    test('No debe bloquear con menos de 5 intentos', () => {
      const user = createTestUser({ loginAttempts: 3 });
      
      UserStateService.incrementLoginAttempts(user);
      
      expect(user.loginAttempts).toBe(4);
      expect(user.status).toBe(UserStatus.ACTIVE);
    });
  });

  describe('RF04.3 - Resetear Intentos de Login', () => {
    test('Debe resetear loginAttempts a 0', () => {
      const user = createTestUser({ loginAttempts: 3 });
      
      UserStateService.resetLoginAttempts(user);
      
      expect(user.loginAttempts).toBe(0);
    });

    test('Debe limpiar lastLoginAttempt', () => {
      const user = createTestUser({ 
        loginAttempts: 3,
        lastLoginAttempt: new Date()
      });
      
      UserStateService.resetLoginAttempts(user);
      
      expect(user.lastLoginAttempt).toBeUndefined();
    });
  });

  describe('RF04.4 - Bloquear Cuenta', () => {
    test('Debe establecer estado BLOCKED', () => {
      const user = createTestUser();
      
      UserStateService.blockAccount(user, 30);
      
      expect(user.status).toBe(UserStatus.BLOCKED);
    });

    test('Debe establecer fecha de desbloqueo correcta', () => {
      const user = createTestUser();
      const antes = Date.now();
      
      UserStateService.blockAccount(user, 30);
      
      const esperado = antes + 30 * 60 * 1000;
      const diferencia = Math.abs(user.blockedUntil!.getTime() - esperado);
      expect(diferencia).toBeLessThan(1000); // Tolerancia de 1 segundo
    });

    test('Debe aceptar diferentes duraciones', () => {
      const user1 = createTestUser();
      const user2 = createTestUser();
      
      UserStateService.blockAccount(user1, 15);
      UserStateService.blockAccount(user2, 60);
      
      expect(user1.blockedUntil!.getTime()).toBeLessThan(user2.blockedUntil!.getTime());
    });
  });

  describe('RF04.5 - Actualizar Último Login', () => {
    test('Debe actualizar lastLogin', () => {
      const user = createTestUser();
      const antes = new Date();
      
      UserStateService.updateLastLogin(user);
      
      expect(user.lastLogin).toBeDefined();
      expect(user.lastLogin!.getTime()).toBeGreaterThanOrEqual(antes.getTime());
    });

    test('Debe resetear intentos de login', () => {
      const user = createTestUser({ loginAttempts: 3 });
      
      UserStateService.updateLastLogin(user);
      
      expect(user.loginAttempts).toBe(0);
      expect(user.lastLoginAttempt).toBeUndefined();
    });
  });

  describe('RF04.6 - Token de Verificación', () => {
    test('Debe establecer verificationToken', () => {
      const user = createTestUser();
      
      UserStateService.setVerificationToken(user, 'token-123');
      
      expect(user.verificationToken).toBe('token-123');
    });
  });

  describe('RF04.7 - Verificar Email', () => {
    test('Debe marcar email como verificado', () => {
      const user = createTestUser({ emailVerified: false });
      
      UserStateService.verifyEmail(user);
      
      expect(user.emailVerified).toBe(true);
    });

    test('Debe establecer fecha de verificación', () => {
      const user = createTestUser();
      const antes = new Date();
      
      UserStateService.verifyEmail(user);
      
      expect(user.emailVerifiedAt).toBeDefined();
      expect(user.emailVerifiedAt!.getTime()).toBeGreaterThanOrEqual(antes.getTime());
    });

    test('Debe limpiar verificationToken', () => {
      const user = createTestUser();
      user.verificationToken = 'token-123';
      
      UserStateService.verifyEmail(user);
      
      expect(user.verificationToken).toBeUndefined();
    });

    test('Debe cambiar estado a ACTIVE', () => {
      const user = createTestUser({ status: UserStatus.PENDING_VERIFICATION });
      
      UserStateService.verifyEmail(user);
      
      expect(user.status).toBe(UserStatus.ACTIVE);
    });
  });

  describe('RF04.8 - Token de Reset de Contraseña', () => {
    test('Debe establecer resetToken', () => {
      const user = createTestUser();
      
      UserStateService.setResetToken(user, 'reset-123');
      
      expect(user.resetToken).toBe('reset-123');
    });

    test('Debe establecer fecha de expiración por defecto (60 min)', () => {
      const user = createTestUser();
      const antes = Date.now();
      
      UserStateService.setResetToken(user, 'reset-123');
      
      const esperado = antes + 60 * 60 * 1000;
      const diferencia = Math.abs(user.resetTokenExpiry!.getTime() - esperado);
      expect(diferencia).toBeLessThan(1000);
    });

    test('Debe aceptar tiempo de expiración personalizado', () => {
      const user = createTestUser();
      const antes = Date.now();
      
      UserStateService.setResetToken(user, 'reset-123', 30);
      
      const esperado = antes + 30 * 60 * 1000;
      const diferencia = Math.abs(user.resetTokenExpiry!.getTime() - esperado);
      expect(diferencia).toBeLessThan(1000);
    });
  });

  describe('RF04.9 - Validar Token de Reset', () => {
    test('Token válido debe retornar true', () => {
      const user = createTestUser({
        resetToken: 'valid-token',
        resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000)
      });
      
      expect(UserStateService.isResetTokenValid(user)).toBe(true);
    });

    test('Token expirado debe retornar false', () => {
      const user = createTestUser({
        resetToken: 'expired-token',
        resetTokenExpiry: new Date(Date.now() - 1000)
      });
      
      expect(UserStateService.isResetTokenValid(user)).toBe(false);
    });

    test('Sin token debe retornar false', () => {
      const user = createTestUser();
      
      expect(UserStateService.isResetTokenValid(user)).toBe(false);
    });

    test('Token sin fecha de expiración debe retornar false', () => {
      const user = createTestUser({ resetToken: 'token-sin-fecha' });
      
      expect(UserStateService.isResetTokenValid(user)).toBe(false);
    });
  });

  describe('RF04.10 - Limpiar Token de Reset', () => {
    test('Debe limpiar resetToken', () => {
      const user = createTestUser({
        resetToken: 'token-123',
        resetTokenExpiry: new Date()
      });
      
      UserStateService.clearResetToken(user);
      
      expect(user.resetToken).toBeUndefined();
    });

    test('Debe limpiar resetTokenExpiry', () => {
      const user = createTestUser({
        resetToken: 'token-123',
        resetTokenExpiry: new Date()
      });
      
      UserStateService.clearResetToken(user);
      
      expect(user.resetTokenExpiry).toBeUndefined();
    });
  });

  describe('RF04.11 - Marcar como Actualizado', () => {
    test('Debe actualizar updatedAt', () => {
      const user = createTestUser();
      const antes = user.updatedAt;
      
      // Pequeña pausa para asegurar diferencia de tiempo
      UserStateService.markAsUpdated(user);
      
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(antes.getTime());
    });
  });
});
