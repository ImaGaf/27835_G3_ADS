/**
 * Tests Unitarios - Modelo Password
 * RF01: Gestión de Usuarios - Validación de Contraseña
 */

import { Password } from '../../../src/models/Password';

describe('Password - Value Object', () => {
  describe('RF01.3 - Crear Password', () => {
    test('Debe crear password sin hash por defecto', () => {
      const password = new Password('MiPassword123!');
      expect(password.value).toBe('MiPassword123!');
      expect(password.isHashed).toBe(false);
    });

    test('Debe crear password indicando que está hasheada', () => {
      const hashedValue = '$2b$12$hashedpasswordvalue';
      const password = new Password(hashedValue, true);
      expect(password.value).toBe(hashedValue);
      expect(password.isHashed).toBe(true);
    });

    test('Debe permitir crear password con caracteres especiales', () => {
      const password = new Password('P@ssw0rd!#$%');
      expect(password.value).toBe('P@ssw0rd!#$%');
    });

    test('Debe preservar el valor exacto de la contraseña', () => {
      const passwordValue = '  Spaces Around  ';
      const password = new Password(passwordValue);
      expect(password.value).toBe(passwordValue);
    });
  });

  describe('RF01.4 - Estado de Hash', () => {
    test('isHashed debe ser false por defecto', () => {
      const password = new Password('plaintext');
      expect(password.isHashed).toBe(false);
    });

    test('isHashed debe reflejar el estado indicado', () => {
      const passwordPlain = new Password('plain', false);
      const passwordHashed = new Password('hashed', true);
      
      expect(passwordPlain.isHashed).toBe(false);
      expect(passwordHashed.isHashed).toBe(true);
    });
  });

  describe('RF01.5 - Inmutabilidad', () => {
    test('El valor debe ser readonly', () => {
      const password = new Password('MyPassword123!');
      expect(typeof password.value).toBe('string');
      expect(password.value).toBe('MyPassword123!');
    });

    test('El estado isHashed debe ser readonly', () => {
      const password = new Password('test', true);
      expect(typeof password.isHashed).toBe('boolean');
      expect(password.isHashed).toBe(true);
    });
  });
});
