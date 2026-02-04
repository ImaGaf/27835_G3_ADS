/**
 * Tests Unitarios - PasswordHashingService
 * RF05: Seguridad - Hashing de Contraseñas
 */

import { PasswordHashingService } from '../../../src/services/PasswordHashingService';

describe('PasswordHashingService', () => {
  let service: PasswordHashingService;

  beforeEach(() => {
    service = new PasswordHashingService();
  });

  describe('RF05.1 - Hash de Contraseña', () => {
    test('Debe generar hash diferente al texto plano', async () => {
      const plainPassword = 'MiPassword123!';
      const hash = await service.hash(plainPassword);
      
      expect(hash).not.toBe(plainPassword);
    });

    test('Hash debe comenzar con identificador bcrypt', async () => {
      const hash = await service.hash('TestPassword1!');
      
      expect(hash).toMatch(/^\$2[aby]?\$/);
    });

    test('Hash debe tener longitud correcta (60 caracteres)', async () => {
      const hash = await service.hash('TestPassword1!');
      
      expect(hash.length).toBe(60);
    });

    test('Mismo password genera hashes diferentes (salt)', async () => {
      const password = 'SamePassword123!';
      
      const hash1 = await service.hash(password);
      const hash2 = await service.hash(password);
      
      expect(hash1).not.toBe(hash2);
    });

    test('Debe hashear contraseñas de diferente longitud', async () => {
      const shortPassword = 'Short1!A';
      const longPassword = 'ThisIsAVeryLongPasswordForTesting123!@#$%';
      
      const hashShort = await service.hash(shortPassword);
      const hashLong = await service.hash(longPassword);
      
      expect(hashShort.length).toBe(60);
      expect(hashLong.length).toBe(60);
    });
  });

  describe('RF05.2 - Comparar Contraseñas', () => {
    test('Debe retornar true para contraseña correcta', async () => {
      const password = 'CorrectPassword123!';
      const hash = await service.hash(password);
      
      const result = await service.compare(password, hash);
      
      expect(result).toBe(true);
    });

    test('Debe retornar false para contraseña incorrecta', async () => {
      const correctPassword = 'CorrectPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hash = await service.hash(correctPassword);
      
      const result = await service.compare(wrongPassword, hash);
      
      expect(result).toBe(false);
    });

    test('Debe ser case-sensitive', async () => {
      const password = 'Password123!';
      const hash = await service.hash(password);
      
      const resultLower = await service.compare('password123!', hash);
      const resultUpper = await service.compare('PASSWORD123!', hash);
      
      expect(resultLower).toBe(false);
      expect(resultUpper).toBe(false);
    });

    test('Debe manejar caracteres especiales', async () => {
      const password = 'P@$$w0rd!#%&*';
      const hash = await service.hash(password);
      
      const result = await service.compare(password, hash);
      
      expect(result).toBe(true);
    });

    test('Debe manejar espacios en contraseña', async () => {
      const password = 'Pass word 123!';
      const hash = await service.hash(password);
      
      const resultWithSpaces = await service.compare(password, hash);
      const resultWithoutSpaces = await service.compare('Password123!', hash);
      
      expect(resultWithSpaces).toBe(true);
      expect(resultWithoutSpaces).toBe(false);
    });
  });

  describe('RF05.3 - Rendimiento', () => {
    test('Hash debe completarse en tiempo razonable', async () => {
      const start = Date.now();
      
      await service.hash('PerformanceTest123!');
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000); // Menos de 5 segundos
    });

    test('Comparación debe completarse en tiempo razonable', async () => {
      const hash = await service.hash('PerformanceTest123!');
      const start = Date.now();
      
      await service.compare('PerformanceTest123!', hash);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000);
    });
  });
});
