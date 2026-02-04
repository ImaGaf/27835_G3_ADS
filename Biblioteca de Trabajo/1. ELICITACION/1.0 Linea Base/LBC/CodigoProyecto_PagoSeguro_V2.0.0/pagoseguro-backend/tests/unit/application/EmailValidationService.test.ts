/**
 * Tests Unitarios - EmailValidationService
 * RF03: Registro de Usuario - Validación de Email
 */

import { EmailValidationService } from '../../../src/services/EmailValidationService';
import { DomainException } from '../../../src/utils/exceptions/DomainException';

describe('EmailValidationService', () => {
  describe('RF03.1 - Validar Formato de Email', () => {
    test('Debe aceptar email válido simple', () => {
      expect(() => {
        EmailValidationService.validate('usuario@ejemplo.com');
      }).not.toThrow();
    });

    test('Debe aceptar email con subdominios', () => {
      expect(() => {
        EmailValidationService.validate('user@sub.domain.com');
      }).not.toThrow();
    });

    test('Debe aceptar email con caracteres especiales', () => {
      expect(() => {
        EmailValidationService.validate('user.name+tag@example.org');
      }).not.toThrow();
    });

    test('Debe aceptar email con mayúsculas', () => {
      expect(() => {
        EmailValidationService.validate('USER@EXAMPLE.COM');
      }).not.toThrow();
    });

    test('Debe rechazar email sin @', () => {
      expect(() => {
        EmailValidationService.validate('usuarioejemplo.com');
      }).toThrow(DomainException);
    });

    test('Debe rechazar email sin dominio', () => {
      expect(() => {
        EmailValidationService.validate('usuario@');
      }).toThrow(DomainException);
    });

    test('Debe rechazar email sin usuario', () => {
      expect(() => {
        EmailValidationService.validate('@ejemplo.com');
      }).toThrow(DomainException);
    });

    test('Debe rechazar email con espacios', () => {
      expect(() => {
        EmailValidationService.validate('user @example.com');
      }).toThrow(DomainException);
    });

    test('Debe rechazar email sin extensión de dominio', () => {
      expect(() => {
        EmailValidationService.validate('user@example');
      }).toThrow(DomainException);
    });
  });

  describe('RF03.2 - Validar Longitud de Email', () => {
    test('Debe aceptar email de longitud normal', () => {
      expect(() => {
        EmailValidationService.validate('normal@email.com');
      }).not.toThrow();
    });

    test('Debe rechazar email demasiado largo (más de 100 caracteres)', () => {
      const emailLargo = 'a'.repeat(90) + '@example.com';
      expect(() => {
        EmailValidationService.validate(emailLargo);
      }).toThrow(DomainException);
    });

    test('Debe aceptar email en el límite (100 caracteres)', () => {
      const emailLimite = 'a'.repeat(87) + '@e.com';
      expect(() => {
        EmailValidationService.validate(emailLimite);
      }).not.toThrow();
    });
  });

  describe('RF03.3 - Normalizar Email', () => {
    test('Debe convertir email a minúsculas', () => {
      const resultado = EmailValidationService.normalize('USER@EXAMPLE.COM');
      expect(resultado).toBe('user@example.com');
    });

    test('Debe eliminar espacios al inicio y final', () => {
      const resultado = EmailValidationService.normalize('  user@example.com  ');
      expect(resultado).toBe('user@example.com');
    });

    test('Debe convertir y eliminar espacios simultáneamente', () => {
      const resultado = EmailValidationService.normalize('  USER@EXAMPLE.COM  ');
      expect(resultado).toBe('user@example.com');
    });

    test('Email ya normalizado debe permanecer igual', () => {
      const resultado = EmailValidationService.normalize('user@example.com');
      expect(resultado).toBe('user@example.com');
    });
  });

  describe('RF03.4 - Mensajes de Error', () => {
    test('Debe incluir mensaje de formato inválido', () => {
      try {
        EmailValidationService.validate('invalido');
        fail('Debería haber lanzado excepción');
      } catch (error) {
        expect(error).toBeInstanceOf(DomainException);
        expect((error as DomainException).message).toContain('formato');
      }
    });

    test('Debe incluir mensaje de email demasiado largo', () => {
      const emailLargo = 'a'.repeat(90) + '@example.com';
      try {
        EmailValidationService.validate(emailLargo);
        fail('Debería haber lanzado excepción');
      } catch (error) {
        expect(error).toBeInstanceOf(DomainException);
        expect((error as DomainException).message).toContain('largo');
      }
    });
  });
});
