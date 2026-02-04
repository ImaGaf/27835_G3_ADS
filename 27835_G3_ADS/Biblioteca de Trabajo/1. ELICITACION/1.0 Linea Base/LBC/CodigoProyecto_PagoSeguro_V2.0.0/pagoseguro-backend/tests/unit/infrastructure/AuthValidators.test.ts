/**
 * Tests Unitarios - Validadores de Autenticación (Zod Schemas)
 * RF02, RF03: Autenticación y Registro - Validación de Entrada
 */

import { 
  registerClientSchema, 
  loginSchema, 
  recoverPasswordSchema 
} from '../../../src/utils/validators/auth.validator';

describe('Auth Validators', () => {
  describe('RF02.5 - loginSchema', () => {
    test('Debe aceptar credenciales válidas', () => {
      const data = {
        email: 'user@example.com',
        password: 'mypassword',
      };

      const result = loginSchema.safeParse(data);
      
      expect(result.success).toBe(true);
    });

    test('Debe normalizar email a minúsculas', () => {
      const data = {
        email: 'USER@EXAMPLE.COM',
        password: 'mypassword',
      };

      const result = loginSchema.parse(data);
      
      expect(result.email).toBe('user@example.com');
    });

    test('Debe rechazar email inválido', () => {
      const data = {
        email: 'invalid-email',
        password: 'mypassword',
      };

      const result = loginSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });

    test('Debe rechazar email vacío', () => {
      const data = {
        email: '',
        password: 'mypassword',
      };

      const result = loginSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });

    test('Debe rechazar password vacío', () => {
      const data = {
        email: 'user@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });

    test('Debe requerir ambos campos', () => {
      const result1 = loginSchema.safeParse({ email: 'user@example.com' });
      const result2 = loginSchema.safeParse({ password: 'password' });
      
      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
    });
  });

  describe('RF03.12 - registerClientSchema', () => {
    const validData = {
      email: 'newuser@example.com',
      password: 'ValidPass123!',
      fullName: 'Usuario Nuevo',
      cedula: '1234567890',
      telefono: '0999999999',
      direccion: 'Dirección de prueba 123 edificio',
    };

    test('Debe aceptar datos de registro válidos', () => {
      const result = registerClientSchema.safeParse(validData);
      
      expect(result.success).toBe(true);
    });

    test('Debe normalizar email a minúsculas', () => {
      const data = { ...validData, email: 'USER@EXAMPLE.COM' };
      
      const result = registerClientSchema.parse(data);
      
      expect(result.email).toBe('user@example.com');
    });

    describe('Validación de Email', () => {
      test('Debe rechazar email inválido', () => {
        const data = { ...validData, email: 'invalid-email' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });

      test('Debe rechazar email sin dominio', () => {
        const data = { ...validData, email: 'user@' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });
    });

    describe('Validación de Password', () => {
      test('Debe rechazar password sin mayúsculas', () => {
        const data = { ...validData, password: 'nouppercase123!' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });

      test('Debe rechazar password sin minúsculas', () => {
        const data = { ...validData, password: 'NOLOWERCASE123!' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });

      test('Debe rechazar password sin números', () => {
        const data = { ...validData, password: 'NoNumbers!!' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });

      test('Debe rechazar password sin caracteres especiales', () => {
        const data = { ...validData, password: 'NoSpecial123' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });

      test('Debe rechazar password corta (menos de 8 caracteres)', () => {
        const data = { ...validData, password: 'Ab1!' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });
    });

    describe('Validación de Nombre Completo', () => {
      test('Debe rechazar nombre muy corto', () => {
        const data = { ...validData, fullName: 'Ab' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });

      test('Debe rechazar nombre muy largo (más de 100 caracteres)', () => {
        const data = { ...validData, fullName: 'A'.repeat(101) };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });

      test('Debe aceptar nombre de 3 caracteres', () => {
        const data = { ...validData, fullName: 'Ana' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(true);
      });
    });

    describe('Validación de Cédula', () => {
      test('Debe rechazar cédula con menos de 10 dígitos', () => {
        const data = { ...validData, cedula: '123456789' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });

      test('Debe rechazar cédula con más de 10 dígitos', () => {
        const data = { ...validData, cedula: '12345678901' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });

      test('Debe rechazar cédula con letras', () => {
        const data = { ...validData, cedula: '123456789a' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });

      test('Debe aceptar cédula válida de 10 dígitos', () => {
        const data = { ...validData, cedula: '0987654321' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(true);
      });
    });

    describe('Validación de Teléfono', () => {
      test('Debe rechazar teléfono muy corto', () => {
        const data = { ...validData, telefono: '09999999' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });

      test('Debe rechazar teléfono muy largo', () => {
        const data = { ...validData, telefono: '0999999999999999' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });

      test('Debe aceptar teléfono de 10 dígitos', () => {
        const data = { ...validData, telefono: '0998765432' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(true);
      });
    });

    describe('Validación de Dirección', () => {
      test('Debe rechazar dirección muy corta', () => {
        const data = { ...validData, direccion: 'Calle 1' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });

      test('Debe rechazar dirección muy larga', () => {
        const data = { ...validData, direccion: 'A'.repeat(251) };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(false);
      });

      test('Debe aceptar dirección válida', () => {
        const data = { ...validData, direccion: 'Av. Principal 123, Edificio Centro' };
        
        const result = registerClientSchema.safeParse(data);
        
        expect(result.success).toBe(true);
      });
    });
  });

  describe('RF06.1 - recoverPasswordSchema', () => {
    test('Debe aceptar email válido', () => {
      const data = { email: 'user@example.com' };
      
      const result = recoverPasswordSchema.safeParse(data);
      
      expect(result.success).toBe(true);
    });

    test('Debe normalizar email a minúsculas', () => {
      const data = { email: 'USER@EXAMPLE.COM' };
      
      const result = recoverPasswordSchema.parse(data);
      
      expect(result.email).toBe('user@example.com');
    });

    test('Debe rechazar email inválido', () => {
      const data = { email: 'invalid-email' };
      
      const result = recoverPasswordSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });

    test('Debe rechazar objeto vacío', () => {
      const result = recoverPasswordSchema.safeParse({});
      
      expect(result.success).toBe(false);
    });

    test('Debe rechazar email vacío', () => {
      const data = { email: '' };
      
      const result = recoverPasswordSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });
  });
});
