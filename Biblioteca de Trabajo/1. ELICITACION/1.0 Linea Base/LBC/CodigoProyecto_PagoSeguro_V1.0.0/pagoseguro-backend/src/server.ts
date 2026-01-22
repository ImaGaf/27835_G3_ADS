import { PrismaClient } from '@prisma/client';
import { config } from './config/env';
import { createApp } from './app';

import { PostgresUserRepository } from './repositories/PostgresUserRepository';
import { PostgresRefreshTokenRepository } from './repositories/PostgresRefreshTokenRepository';
import { PostgresAuditLogRepository } from './repositories/PostgresAuditLogRepository';

import { JWTTokenService } from './services/JWTTokenService';
import { SendGridEmailService } from './services/SendGridEmailService';

import { AuthService } from './services/AuthService';
import { UserDomainService } from './services/UserDomainService';
import { AuditService } from './services/AuditService';
import { AuthController } from './controllers/AuthController';
import { AuthMiddleware } from './middleware/auth.middleware';
import { createAuthRoutes } from './routes/auth.routes';

export const prisma = new PrismaClient({
  log: config.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export async function initializeServer() {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a PostgreSQL establecida');
  } catch (error: unknown) {
    console.error('❌ Error al conectar con PostgreSQL:', error);
    process.exit(1);
  }

  const userRepository = new PostgresUserRepository(prisma);
  const refreshTokenRepository = new PostgresRefreshTokenRepository(prisma);
  const auditLogRepository = new PostgresAuditLogRepository(prisma);

  const tokenService = new JWTTokenService();
  const emailService = new SendGridEmailService();

  // Servicios de negocio separados por responsabilidad
  const auditService = new AuditService(auditLogRepository);
  const userDomainService = new UserDomainService(userRepository, emailService);

  // Servicio orquestador
  const authService = new AuthService(
    userRepository,
    refreshTokenRepository,
    tokenService,
    userDomainService,
    auditService
  );

  const authController = new AuthController(authService);
  const authMiddleware = new AuthMiddleware(tokenService);

  const authRouter = createAuthRoutes(authController, authMiddleware);

  const app = createApp(authRouter);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
  });

  return app;
}
