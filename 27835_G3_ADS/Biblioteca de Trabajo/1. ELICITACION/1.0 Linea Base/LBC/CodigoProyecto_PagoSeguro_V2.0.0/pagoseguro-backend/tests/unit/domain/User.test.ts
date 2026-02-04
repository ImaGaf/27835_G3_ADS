/**
 * Tests Unitarios - Modelo User
 * RF01: Gestión de Usuarios - Entidad Usuario
 */

import { User, UserRole, UserStatus } from '../../../src/models/User';
import { Email } from '../../../src/models/Email';
import { Password } from '../../../src/models/Password';

describe('User - Entity', () => {
  const createTestUser = (overrides: Partial<{
    id: string;
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    status: UserStatus;
    cedula: string;
    telefono: string;
    direccion: string;
    loginAttempts: number;
    emailVerified: boolean;
  }> = {}): User => {
    return new User(
      overrides.id || 'test-id-123',
      new Email(overrides.email || 'test@example.com'),
      new Password(overrides.password || 'HashedPassword123!', true),
      overrides.fullName || 'Usuario de Prueba',
      overrides.role || UserRole.CLIENTE,
      overrides.status || UserStatus.ACTIVE,
      overrides.cedula || '1234567890',
      overrides.telefono || '0999999999',
      overrides.direccion || 'Dirección de prueba 123',
      overrides.loginAttempts || 0,
      undefined, // lastLoginAttempt
      undefined, // blockedUntil
      undefined, // lastLogin
      overrides.emailVerified || false
    );
  };

  describe('RF01.6 - Crear Usuario', () => {
    test('Debe crear usuario con datos válidos', () => {
      const user = createTestUser();
      
      expect(user.id).toBe('test-id-123');
      expect(user.email.value).toBe('test@example.com');
      expect(user.fullName).toBe('Usuario de Prueba');
      expect(user.role).toBe(UserRole.CLIENTE);
      expect(user.status).toBe(UserStatus.ACTIVE);
    });

    test('Debe crear usuario con rol CLIENTE', () => {
      const user = createTestUser({ role: UserRole.CLIENTE });
      expect(user.role).toBe(UserRole.CLIENTE);
    });

    test('Debe crear usuario con rol ASISTENTE', () => {
      const user = createTestUser({ role: UserRole.ASISTENTE });
      expect(user.role).toBe(UserRole.ASISTENTE);
    });

    test('Debe crear usuario con rol GERENTE', () => {
      const user = createTestUser({ role: UserRole.GERENTE });
      expect(user.role).toBe(UserRole.GERENTE);
    });

    test('Debe crear usuario con todos los campos opcionales', () => {
      const user = createTestUser({
        cedula: '0987654321',
        telefono: '0988888888',
        direccion: 'Av. Principal 456',
      });
      
      expect(user.cedula).toBe('0987654321');
      expect(user.telefono).toBe('0988888888');
      expect(user.direccion).toBe('Av. Principal 456');
    });
  });

  describe('RF01.7 - Estados del Usuario', () => {
    test('Usuario puede tener estado ACTIVE', () => {
      const user = createTestUser({ status: UserStatus.ACTIVE });
      expect(user.status).toBe(UserStatus.ACTIVE);
    });

    test('Usuario puede tener estado INACTIVE', () => {
      const user = createTestUser({ status: UserStatus.INACTIVE });
      expect(user.status).toBe(UserStatus.INACTIVE);
    });

    test('Usuario puede tener estado PENDING_VERIFICATION', () => {
      const user = createTestUser({ status: UserStatus.PENDING_VERIFICATION });
      expect(user.status).toBe(UserStatus.PENDING_VERIFICATION);
    });

    test('Usuario puede tener estado BLOCKED', () => {
      const user = createTestUser({ status: UserStatus.BLOCKED });
      expect(user.status).toBe(UserStatus.BLOCKED);
    });
  });

  describe('RF01.8 - Intentos de Login', () => {
    test('loginAttempts debe iniciar en 0 por defecto', () => {
      const user = createTestUser();
      expect(user.loginAttempts).toBe(0);
    });

    test('Debe permitir establecer loginAttempts', () => {
      const user = createTestUser({ loginAttempts: 3 });
      expect(user.loginAttempts).toBe(3);
    });

    test('loginAttempts debe ser modificable', () => {
      const user = createTestUser();
      user.loginAttempts = 5;
      expect(user.loginAttempts).toBe(5);
    });
  });

  describe('RF01.9 - Verificación de Email', () => {
    test('emailVerified debe ser false por defecto', () => {
      const user = createTestUser();
      expect(user.emailVerified).toBe(false);
    });

    test('Debe permitir establecer emailVerified en true', () => {
      const user = createTestUser({ emailVerified: true });
      expect(user.emailVerified).toBe(true);
    });

    test('emailVerified debe ser modificable', () => {
      const user = createTestUser();
      user.emailVerified = true;
      expect(user.emailVerified).toBe(true);
    });
  });

  describe('RF01.10 - Propiedades de Fecha', () => {
    test('createdAt debe ser establecido automáticamente', () => {
      const user = createTestUser();
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    test('updatedAt debe ser establecido automáticamente', () => {
      const user = createTestUser();
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    test('lastLogin debe ser undefined inicialmente', () => {
      const user = createTestUser();
      expect(user.lastLogin).toBeUndefined();
    });

    test('lastLogin debe ser modificable', () => {
      const user = createTestUser();
      const now = new Date();
      user.lastLogin = now;
      expect(user.lastLogin).toBe(now);
    });
  });
});

describe('UserRole - Enum', () => {
  test('Debe tener valor CLIENTE', () => {
    expect(UserRole.CLIENTE).toBe('CLIENTE');
  });

  test('Debe tener valor ASISTENTE', () => {
    expect(UserRole.ASISTENTE).toBe('ASISTENTE');
  });

  test('Debe tener valor GERENTE', () => {
    expect(UserRole.GERENTE).toBe('GERENTE');
  });
});

describe('UserStatus - Enum', () => {
  test('Debe tener valor ACTIVE', () => {
    expect(UserStatus.ACTIVE).toBe('ACTIVE');
  });

  test('Debe tener valor INACTIVE', () => {
    expect(UserStatus.INACTIVE).toBe('INACTIVE');
  });

  test('Debe tener valor PENDING_VERIFICATION', () => {
    expect(UserStatus.PENDING_VERIFICATION).toBe('PENDING_VERIFICATION');
  });

  test('Debe tener valor BLOCKED', () => {
    expect(UserStatus.BLOCKED).toBe('BLOCKED');
  });
});
