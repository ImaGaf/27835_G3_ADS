import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123*', 10);

  // GERENTE
  await prisma.user.upsert({
    where: { email: 'gerente@pagoseguro.com' },
    update: {},
    create: {
      email: 'gerente@pagoseguro.com',
      password: passwordHash,
      fullName: 'Gerente General',
      role: UserRole.GERENTE,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
  });

  // ASISTENTE
  await prisma.user.upsert({
    where: { email: 'asistente@pagoseguro.com' },
    update: {},
    create: {
      email: 'asistente@pagoseguro.com',
      password: passwordHash,
      fullName: 'Asistente Operativo',
      role: UserRole.ASISTENTE,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
  });

  console.log('✅ Usuarios administrativos creados');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
