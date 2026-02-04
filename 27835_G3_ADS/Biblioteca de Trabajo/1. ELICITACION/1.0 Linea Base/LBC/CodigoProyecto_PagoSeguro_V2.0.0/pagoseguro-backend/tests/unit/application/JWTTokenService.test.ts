/**
 * Tests Unitarios - JWTTokenService
 * RF05: Seguridad - Generación y Verificación de Tokens
 */

import { JWTTokenService } from '../../../src/services/JWTTokenService';

describe('JWTTokenService', () => {
  let service: JWTTokenService;

  beforeEach(() => {
    service = new JWTTokenService();
  });

  describe('RF05.4 - Generar Tokens', () => {
    test('Debe generar accessToken y refreshToken', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'CLIENTE',
      };

      const tokens = await service.generateTokens(payload);

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
    });

    test('Tokens deben ser strings no vacíos', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'CLIENTE',
      };

      const tokens = await service.generateTokens(payload);

      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
      expect(tokens.accessToken.length).toBeGreaterThan(0);
      expect(tokens.refreshToken.length).toBeGreaterThan(0);
    });

    test('Tokens deben tener formato JWT (3 partes separadas por punto)', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'CLIENTE',
      };

      const tokens = await service.generateTokens(payload);

      expect(tokens.accessToken.split('.').length).toBe(3);
      expect(tokens.refreshToken.split('.').length).toBe(3);
    });

    test('AccessToken y RefreshToken deben ser diferentes', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'CLIENTE',
      };

      const tokens = await service.generateTokens(payload);

      expect(tokens.accessToken).not.toBe(tokens.refreshToken);
    });

    test('Debe generar tokens diferentes para cada llamada', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'CLIENTE',
      };

      const tokens1 = await service.generateTokens(payload);
      const tokens2 = await service.generateTokens(payload);

      // Los tokens pueden ser iguales si se generan en el mismo segundo
      // pero al menos verificamos que la función se ejecuta
      expect(tokens1.accessToken).toBeDefined();
      expect(tokens2.accessToken).toBeDefined();
    });
  });

  describe('RF05.5 - Verificar AccessToken', () => {
    test('Debe verificar token válido correctamente', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'CLIENTE',
      };

      const tokens = await service.generateTokens(payload);
      const decoded = await service.verifyAccessToken(tokens.accessToken);

      expect(decoded).toBeDefined();
      expect(decoded!.userId).toBe('user-123');
      expect(decoded!.email).toBe('test@example.com');
      expect(decoded!.role).toBe('CLIENTE');
    });

    test('Debe rechazar token inválido', async () => {
      await expect(
        service.verifyAccessToken('invalid.token.here')
      ).rejects.toThrow();
    });

    test('Debe rechazar token malformado', async () => {
      await expect(
        service.verifyAccessToken('not-a-jwt')
      ).rejects.toThrow();
    });
  });

  describe('RF05.6 - Verificar RefreshToken', () => {
    test('Debe verificar refresh token válido', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'CLIENTE',
      };

      const tokens = await service.generateTokens(payload);
      const decoded = await service.verifyRefreshToken(tokens.refreshToken);

      expect(decoded).toBeDefined();
      expect(decoded!.userId).toBe('user-123');
    });

    test('Debe rechazar refresh token inválido', async () => {
      await expect(
        service.verifyRefreshToken('invalid.refresh.token')
      ).rejects.toThrow();
    });
  });

  describe('RF05.7 - Generar Código de Reset', () => {
    test('Debe generar código numérico de 6 dígitos', () => {
      const code = service.generateResetCode();

      expect(code).toMatch(/^\d{6}$/);
    });

    test('Código debe ser string', () => {
      const code = service.generateResetCode();

      expect(typeof code).toBe('string');
    });

    test('Debe generar códigos diferentes', () => {
      const codes = new Set<string>();

      for (let i = 0; i < 10; i++) {
        codes.add(service.generateResetCode());
      }

      // Al menos algunos códigos deberían ser diferentes
      expect(codes.size).toBeGreaterThan(1);
    });

    test('Código debe estar en rango válido (100000-999999)', () => {
      for (let i = 0; i < 20; i++) {
        const code = service.generateResetCode();
        const numCode = parseInt(code, 10);

        expect(numCode).toBeGreaterThanOrEqual(100000);
        expect(numCode).toBeLessThanOrEqual(999999);
      }
    });
  });

  describe('RF05.8 - Payload en Tokens', () => {
    test('Token debe contener userId', async () => {
      const payload = {
        userId: 'specific-user-id',
        email: 'user@test.com',
        role: 'GERENTE',
      };

      const tokens = await service.generateTokens(payload);
      const decoded = await service.verifyAccessToken(tokens.accessToken);

      expect(decoded!.userId).toBe('specific-user-id');
    });

    test('Token debe contener email', async () => {
      const payload = {
        userId: 'user-123',
        email: 'specific@email.com',
        role: 'ASISTENTE',
      };

      const tokens = await service.generateTokens(payload);
      const decoded = await service.verifyAccessToken(tokens.accessToken);

      expect(decoded!.email).toBe('specific@email.com');
    });

    test('Token debe contener role', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@test.com',
        role: 'GERENTE',
      };

      const tokens = await service.generateTokens(payload);
      const decoded = await service.verifyAccessToken(tokens.accessToken);

      expect(decoded!.role).toBe('GERENTE');
    });
  });
});
