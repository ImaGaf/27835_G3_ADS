/**
 * Tests Unitarios - PasswordValidationService
 * RF03: Registro de Usuario - Validación de Contraseña
 */

import { PasswordValidationService } from '../../../src/services/PasswordValidationService';
import { DomainException } from '../../../src/utils/exceptions/DomainException';

describe('PasswordValidationService', () => {
  describe('RF03.5 - Validar Longitud Mínima', () => {
    test('Debe aceptar contraseña de 8 caracteres', () => {
      expect(() => {
        PasswordValidationService.validate('Abc123!@');
      }).not.toThrow();
    });

    test('Debe aceptar contraseña mayor a 8 caracteres', () => {
      expect(() => {
        PasswordValidationService.validate('Abcdefg123!@#');
      }).not.toThrow();
    });

    test('Debe rechazar contraseña menor a 8 caracteres', () => {
      expect(() => {
        PasswordValidationService.validate('Abc12!');
      }).toThrow(DomainException);
    });

    test('Debe rechazar contraseña vacía', () => {
      expect(() => {
        PasswordValidationService.validate('');
      }).toThrow(DomainException);
    });

    test('Mensaje debe indicar longitud mínima de 8 caracteres', () => {
      try {
        PasswordValidationService.validate('Abc1!');
        fail('Debería haber lanzado excepción');
      } catch (error) {
        expect((error as DomainException).message).toContain('8 caracteres');
      }
    });
  });

  describe('RF03.6 - Validar Mayúsculas', () => {
    test('Debe aceptar contraseña con mayúsculas', () => {
      expect(() => {
        PasswordValidationService.validate('Abcdefg1!');
      }).not.toThrow();
    });

    test('Debe rechazar contraseña sin mayúsculas', () => {
      expect(() => {
        PasswordValidationService.validate('abcdefg1!');
      }).toThrow(DomainException);
    });

    test('Mensaje debe indicar necesidad de mayúscula', () => {
      try {
        PasswordValidationService.validate('abcdefg1!');
        fail('Debería haber lanzado excepción');
      } catch (error) {
        expect((error as DomainException).message).toContain('mayúscula');
      }
    });
  });

  describe('RF03.7 - Validar Minúsculas', () => {
    test('Debe aceptar contraseña con minúsculas', () => {
      expect(() => {
        PasswordValidationService.validate('ABCdefg1!');
      }).not.toThrow();
    });

    test('Debe rechazar contraseña sin minúsculas', () => {
      expect(() => {
        PasswordValidationService.validate('ABCDEFG1!');
      }).toThrow(DomainException);
    });

    test('Mensaje debe indicar necesidad de minúscula', () => {
      try {
        PasswordValidationService.validate('ABCDEFG1!');
        fail('Debería haber lanzado excepción');
      } catch (error) {
        expect((error as DomainException).message).toContain('minúscula');
      }
    });
  });

  describe('RF03.8 - Validar Números', () => {
    test('Debe aceptar contraseña con números', () => {
      expect(() => {
        PasswordValidationService.validate('Abcdefg1!');
      }).not.toThrow();
    });

    test('Debe rechazar contraseña sin números', () => {
      expect(() => {
        PasswordValidationService.validate('Abcdefgh!');
      }).toThrow(DomainException);
    });

    test('Mensaje debe indicar necesidad de número', () => {
      try {
        PasswordValidationService.validate('Abcdefgh!');
        fail('Debería haber lanzado excepción');
      } catch (error) {
        expect((error as DomainException).message).toContain('número');
      }
    });
  });

  describe('RF03.9 - Validar Caracteres Especiales', () => {
    test('Debe aceptar contraseña con @', () => {
      expect(() => {
        PasswordValidationService.validate('Abcdefg1@');
      }).not.toThrow();
    });

    test('Debe aceptar contraseña con $', () => {
      expect(() => {
        PasswordValidationService.validate('Abcdefg1$');
      }).not.toThrow();
    });

    test('Debe aceptar contraseña con !', () => {
      expect(() => {
        PasswordValidationService.validate('Abcdefg1!');
      }).not.toThrow();
    });

    test('Debe aceptar contraseña con %', () => {
      expect(() => {
        PasswordValidationService.validate('Abcdefg1%');
      }).not.toThrow();
    });

    test('Debe aceptar contraseña con *', () => {
      expect(() => {
        PasswordValidationService.validate('Abcdefg1*');
      }).not.toThrow();
    });

    test('Debe aceptar contraseña con ?', () => {
      expect(() => {
        PasswordValidationService.validate('Abcdefg1?');
      }).not.toThrow();
    });

    test('Debe aceptar contraseña con &', () => {
      expect(() => {
        PasswordValidationService.validate('Abcdefg1&');
      }).not.toThrow();
    });

    test('Debe rechazar contraseña sin caracteres especiales', () => {
      expect(() => {
        PasswordValidationService.validate('Abcdefg12');
      }).toThrow(DomainException);
    });

    test('Mensaje debe indicar caracteres especiales permitidos', () => {
      try {
        PasswordValidationService.validate('Abcdefg12');
        fail('Debería haber lanzado excepción');
      } catch (error) {
        expect((error as DomainException).message).toContain('especial');
      }
    });
  });

  describe('RF03.10 - Validación Completa', () => {
    test('Debe aceptar contraseña que cumple todos los requisitos', () => {
      const validPasswords = [
        'Password1!',
        'MyP@ssw0rd',
        'Secure$123',
        'Test&User1',
        'Admin*2024',
      ];

      validPasswords.forEach(password => {
        expect(() => {
          PasswordValidationService.validate(password);
        }).not.toThrow();
      });
    });

    test('Debe rechazar primera violación encontrada', () => {
      expect(() => {
        // Falla por longitud primero
        PasswordValidationService.validate('Ab1!');
      }).toThrow();
    });
  });
});
