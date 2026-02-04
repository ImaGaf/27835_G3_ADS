/**
 * Setup file for Jest tests
 * Configuración global para todas las pruebas unitarias
 */

// Mock de variables de entorno para tests
process.env.JWT_SECRET = 'test-secret-key-for-testing-purposes-only';
process.env.JWT_ACCESS_EXPIRATION = '15m';
process.env.JWT_REFRESH_EXPIRATION = '7d';
process.env.BCRYPT_ROUNDS = '4'; // Rounds bajos para tests más rápidos
process.env.NODE_ENV = 'test';

// Silenciar console.log y console.error durante tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock de crypto.randomUUID para tests determinísticos
const mockUUID = jest.fn(() => 'test-uuid-12345');
global.crypto = {
  ...global.crypto,
  randomUUID: mockUUID as any,
};

// Timeout extendido para tests asíncronos
jest.setTimeout(10000);

// Limpiar todos los mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

// Limpiar todos los mocks después de todos los tests
afterAll(() => {
  jest.resetAllMocks();
});
