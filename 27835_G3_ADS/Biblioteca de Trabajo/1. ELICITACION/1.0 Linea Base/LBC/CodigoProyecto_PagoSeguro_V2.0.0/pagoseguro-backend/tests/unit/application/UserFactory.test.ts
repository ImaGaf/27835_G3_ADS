/**
 * Tests Unitarios - UserFactory
 * RF01, RF03: Gestión de Usuarios - Creación de Usuarios
 */

import { UserFactory } from '../../../src/factories/UserFactory';
import { UserRole, UserStatus } from '../../../src/models/User';

describe('UserFactory', () => {
  describe('RF01.11 - Crear Nuevo Usuario', () => {
    test('Debe crear usuario con datos válidos', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'ValidPass123!',
        fullName: 'Nuevo Usuario',
        role: UserRole.CLIENTE,
        cedula: '1234567890',
        telefono: '0999999999',
        direccion: 'Dirección de prueba 123',
      };

      const user = await UserFactory.createNew(userData);

      expect(user).toBeDefined();
      expect(user.email.value).toBe('newuser@example.com');
      expect(user.fullName).toBe('Nuevo Usuario');
      expect(user.role).toBe(UserRole.CLIENTE);
    });

    test('Email debe ser normalizado (minúsculas)', async () => {
      const user = await UserFactory.createNew({
        email: 'USER@EXAMPLE.COM',
        password: 'ValidPass123!',
        fullName: 'Test User',
        role: UserRole.CLIENTE,
      });

      expect(user.email.value).toBe('user@example.com');
    });

    test('Password debe ser hasheada', async () => {
      const plainPassword = 'PlainPassword123!';
      
      const user = await UserFactory.createNew({
        email: 'test@example.com',
        password: plainPassword,
        fullName: 'Test User',
        role: UserRole.CLIENTE,
      });

      expect(user.password.value).not.toBe(plainPassword);
      expect(user.password.isHashed).toBe(true);
    });

    test('Estado inicial debe ser PENDING_VERIFICATION', async () => {
      const user = await UserFactory.createNew({
        email: 'test@example.com',
        password: 'ValidPass123!',
        fullName: 'Test User',
        role: UserRole.CLIENTE,
      });

      expect(user.status).toBe(UserStatus.PENDING_VERIFICATION);
    });

    test('loginAttempts debe iniciar en 0', async () => {
      const user = await UserFactory.createNew({
        email: 'test@example.com',
        password: 'ValidPass123!',
        fullName: 'Test User',
        role: UserRole.CLIENTE,
      });

      expect(user.loginAttempts).toBe(0);
    });

    test('emailVerified debe ser false', async () => {
      const user = await UserFactory.createNew({
        email: 'test@example.com',
        password: 'ValidPass123!',
        fullName: 'Test User',
        role: UserRole.CLIENTE,
      });

      expect(user.emailVerified).toBe(false);
    });

    test('Debe generar ID único', async () => {
      const user = await UserFactory.createNew({
        email: 'test@example.com',
        password: 'ValidPass123!',
        fullName: 'Test User',
        role: UserRole.CLIENTE,
      });

      expect(user.id).toBeDefined();
      expect(typeof user.id).toBe('string');
      expect(user.id.length).toBeGreaterThan(0);
    });

    test('Debe establecer createdAt', async () => {
      const antes = new Date();
      
      const user = await UserFactory.createNew({
        email: 'test@example.com',
        password: 'ValidPass123!',
        fullName: 'Test User',
        role: UserRole.CLIENTE,
      });

      expect(user.createdAt).toBeDefined();
      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(antes.getTime());
    });

    test('Debe incluir campos opcionales', async () => {
      const user = await UserFactory.createNew({
        email: 'test@example.com',
        password: 'ValidPass123!',
        fullName: 'Test User',
        role: UserRole.CLIENTE,
        cedula: '0987654321',
        telefono: '0988888888',
        direccion: 'Av. Principal 456',
      });

      expect(user.cedula).toBe('0987654321');
      expect(user.telefono).toBe('0988888888');
      expect(user.direccion).toBe('Av. Principal 456');
    });

    test('Debe crear usuario con rol ASISTENTE', async () => {
      const user = await UserFactory.createNew({
        email: 'assistant@example.com',
        password: 'ValidPass123!',
        fullName: 'Asistente Usuario',
        role: UserRole.ASISTENTE,
      });

      expect(user.role).toBe(UserRole.ASISTENTE);
    });

    test('Debe crear usuario con rol GERENTE', async () => {
      const user = await UserFactory.createNew({
        email: 'manager@example.com',
        password: 'ValidPass123!',
        fullName: 'Gerente Usuario',
        role: UserRole.GERENTE,
      });

      expect(user.role).toBe(UserRole.GERENTE);
    });

    test('Debe incluir createdBy si se proporciona', async () => {
      const user = await UserFactory.createNew({
        email: 'test@example.com',
        password: 'ValidPass123!',
        fullName: 'Test User',
        role: UserRole.CLIENTE,
        createdBy: 'admin-user-id',
      });

      expect(user.createdBy).toBe('admin-user-id');
    });
  });

  describe('RF01.12 - Reconstituir Usuario', () => {
    test('Debe reconstituir usuario desde datos existentes', () => {
      const existingData = {
        id: 'existing-id-123',
        email: 'existing@example.com',
        password: '$2b$12$hashedpassword',
        fullName: 'Usuario Existente',
        role: UserRole.CLIENTE,
        status: UserStatus.ACTIVE,
        cedula: '1234567890',
        telefono: '0999999999',
        direccion: 'Dirección existente',
        loginAttempts: 2,
        lastLoginAttempt: new Date(),
        blockedUntil: undefined,
        lastLogin: new Date(),
        emailVerified: true,
        emailVerifiedAt: new Date(),
        verificationToken: undefined,
        resetToken: undefined,
        resetTokenExpiry: undefined,
        createdAt: new Date(),
        createdBy: 'admin',
        updatedAt: new Date(),
      };

      const user = UserFactory.reconstitute(existingData);

      expect(user.id).toBe('existing-id-123');
      expect(user.email.value).toBe('existing@example.com');
      expect(user.fullName).toBe('Usuario Existente');
      expect(user.status).toBe(UserStatus.ACTIVE);
      expect(user.emailVerified).toBe(true);
    });

    test('Password debe marcarse como hasheada', () => {
      const existingData = {
        id: 'id-123',
        email: 'test@example.com',
        password: '$2b$12$hashedpassword',
        fullName: 'Test User',
        role: UserRole.CLIENTE,
        status: UserStatus.ACTIVE,
        loginAttempts: 0,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const user = UserFactory.reconstitute(existingData);

      expect(user.password.isHashed).toBe(true);
    });

    test('Debe preservar todos los campos', () => {
      const now = new Date();
      const existingData = {
        id: 'full-id-123',
        email: 'full@example.com',
        password: '$2b$12$hash',
        fullName: 'Full User',
        role: UserRole.GERENTE,
        status: UserStatus.BLOCKED,
        cedula: '9876543210',
        telefono: '0911111111',
        direccion: 'Full Address',
        loginAttempts: 5,
        lastLoginAttempt: now,
        blockedUntil: new Date(now.getTime() + 30 * 60 * 1000),
        lastLogin: now,
        emailVerified: true,
        emailVerifiedAt: now,
        verificationToken: 'ver-token',
        resetToken: 'reset-token',
        resetTokenExpiry: new Date(now.getTime() + 60 * 60 * 1000),
        createdAt: now,
        createdBy: 'system',
        updatedAt: now,
      };

      const user = UserFactory.reconstitute(existingData);

      expect(user.cedula).toBe('9876543210');
      expect(user.telefono).toBe('0911111111');
      expect(user.direccion).toBe('Full Address');
      expect(user.loginAttempts).toBe(5);
      expect(user.verificationToken).toBe('ver-token');
      expect(user.resetToken).toBe('reset-token');
      expect(user.createdBy).toBe('system');
    });
  });

  describe('RF03.11 - Validación en Creación', () => {
    test('Debe rechazar email inválido', async () => {
      await expect(
        UserFactory.createNew({
          email: 'invalid-email',
          password: 'ValidPass123!',
          fullName: 'Test User',
          role: UserRole.CLIENTE,
        })
      ).rejects.toThrow();
    });

    test('Debe rechazar password sin mayúsculas', async () => {
      await expect(
        UserFactory.createNew({
          email: 'test@example.com',
          password: 'nouppercase123!',
          fullName: 'Test User',
          role: UserRole.CLIENTE,
        })
      ).rejects.toThrow();
    });

    test('Debe rechazar password sin caracteres especiales', async () => {
      await expect(
        UserFactory.createNew({
          email: 'test@example.com',
          password: 'NoSpecialChar123',
          fullName: 'Test User',
          role: UserRole.CLIENTE,
        })
      ).rejects.toThrow();
    });

    test('Debe rechazar password corta', async () => {
      await expect(
        UserFactory.createNew({
          email: 'test@example.com',
          password: 'Sho1!',
          fullName: 'Test User',
          role: UserRole.CLIENTE,
        })
      ).rejects.toThrow();
    });
  });
});
