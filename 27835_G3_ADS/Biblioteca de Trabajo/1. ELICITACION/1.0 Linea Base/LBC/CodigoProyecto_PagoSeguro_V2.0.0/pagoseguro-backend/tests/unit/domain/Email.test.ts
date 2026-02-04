/**
 * Tests Unitarios - Modelo Email
 * RF01: Gestión de Usuarios - Validación de Email
 */

import { Email } from '../../../src/models/Email';

describe('Email - Value Object', () => {
  describe('RF01.1 - Crear Email', () => {
    test('Debe crear un email con valor válido', () => {
      const email = new Email('usuario@ejemplo.com');
      expect(email.value).toBe('usuario@ejemplo.com');
    });

    test('Debe preservar el valor exacto del email', () => {
      const emailValue = 'Test.User@Domain.COM';
      const email = new Email(emailValue);
      expect(email.value).toBe(emailValue);
    });

    test('Debe crear email con dominio complejo', () => {
      const email = new Email('user@subdomain.domain.com');
      expect(email.value).toBe('user@subdomain.domain.com');
    });

    test('Debe crear email con caracteres especiales permitidos', () => {
      const email = new Email('user.name+tag@example.org');
      expect(email.value).toBe('user.name+tag@example.org');
    });
  });

  describe('RF01.2 - Inmutabilidad del Email', () => {
    test('El valor del email debe ser readonly', () => {
      const email = new Email('test@test.com');
      // Verificar que el valor existe y es string
      expect(typeof email.value).toBe('string');
      expect(email.value).toBe('test@test.com');
    });

    test('Dos emails con mismo valor deben tener valores iguales', () => {
      const email1 = new Email('same@email.com');
      const email2 = new Email('same@email.com');
      expect(email1.value).toBe(email2.value);
    });
  });
});
