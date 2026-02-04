/**
 * Tests Unitarios - Excepciones de Dominio
 * RF02: Autenticación - Manejo de Errores
 */

import { DomainException } from '../../../src/utils/exceptions/DomainException';
import { InvalidCredentialsException } from '../../../src/utils/exceptions/InvalidCredentialsException';
import { UserAlreadyExistsException } from '../../../src/utils/exceptions/UserAlreadyExistsException';
import { UserNotFoundException } from '../../../src/utils/exceptions/UserNotFoundException';

describe('DomainException', () => {
  describe('RF02.1 - Excepción Base', () => {
    test('Debe crear excepción con mensaje personalizado', () => {
      const exception = new DomainException('Error de prueba');
      expect(exception.message).toBe('Error de prueba');
      expect(exception.name).toBe('DomainException');
    });

    test('Debe ser instancia de Error', () => {
      const exception = new DomainException('Test');
      expect(exception).toBeInstanceOf(Error);
    });

    test('Debe ser instancia de DomainException', () => {
      const exception = new DomainException('Test');
      expect(exception).toBeInstanceOf(DomainException);
    });
  });
});

describe('InvalidCredentialsException', () => {
  describe('RF02.2 - Credenciales Inválidas', () => {
    test('Debe tener mensaje predeterminado', () => {
      const exception = new InvalidCredentialsException();
      expect(exception.message).toBe('Credenciales incorrectas');
    });

    test('Debe tener nombre correcto', () => {
      const exception = new InvalidCredentialsException();
      expect(exception.name).toBe('InvalidCredentialsException');
    });

    test('Debe ser instancia de DomainException', () => {
      const exception = new InvalidCredentialsException();
      expect(exception).toBeInstanceOf(DomainException);
    });

    test('Debe ser instancia de Error', () => {
      const exception = new InvalidCredentialsException();
      expect(exception).toBeInstanceOf(Error);
    });
  });
});

describe('UserAlreadyExistsException', () => {
  describe('RF02.3 - Usuario Ya Existe', () => {
    test('Debe incluir email en el mensaje', () => {
      const exception = new UserAlreadyExistsException('test@email.com');
      expect(exception.message).toBe('El email test@email.com ya está registrado');
    });

    test('Debe tener nombre correcto', () => {
      const exception = new UserAlreadyExistsException('test@email.com');
      expect(exception.name).toBe('UserAlreadyExistsException');
    });

    test('Debe ser instancia de DomainException', () => {
      const exception = new UserAlreadyExistsException('test@email.com');
      expect(exception).toBeInstanceOf(DomainException);
    });

    test('Debe manejar cédula como identificador', () => {
      const exception = new UserAlreadyExistsException('1234567890');
      expect(exception.message).toBe('El email 1234567890 ya está registrado');
    });
  });
});

describe('UserNotFoundException', () => {
  describe('RF02.4 - Usuario No Encontrado', () => {
    test('Debe tener mensaje predeterminado', () => {
      const exception = new UserNotFoundException();
      expect(exception.message).toBe('Usuario no encontrado');
    });

    test('Debe tener nombre correcto', () => {
      const exception = new UserNotFoundException();
      expect(exception.name).toBe('UserNotFoundException');
    });

    test('Debe ser instancia de DomainException', () => {
      const exception = new UserNotFoundException();
      expect(exception).toBeInstanceOf(DomainException);
    });

    test('Debe ser instancia de Error', () => {
      const exception = new UserNotFoundException();
      expect(exception).toBeInstanceOf(Error);
    });
  });
});
