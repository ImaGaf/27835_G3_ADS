import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../lib/interfaces';
import { UserFactory } from '../factories/UserFactory';
import { User, UserRole, UserStatus } from '../models/User';


export class PostgresUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email.value,
        password: user.password.value,
        fullName: user.fullName,
        role: user.role as any,
        status: user.status as any,
        cedula: user.cedula,
        telefono: user.telefono,
        direccion: user.direccion,
        loginAttempts: user.loginAttempts,
        lastLoginAttempt: user.lastLoginAttempt,
        blockedUntil: user.blockedUntil,
        lastLogin: user.lastLogin,
        emailVerified: user.emailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        verificationToken: user.verificationToken,
        resetToken: user.resetToken,
        resetTokenExpiry: user.resetTokenExpiry,
        createdAt: user.createdAt,
        createdBy: user.createdBy,
        updatedAt: user.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userData) return null;

    return UserFactory.reconstitute({
      id: userData.id,
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
      role: userData.role as UserRole,
      status: userData.status as UserStatus,
      cedula: userData.cedula || undefined,
      telefono: userData.telefono || undefined,
      direccion: userData.direccion || undefined,
      loginAttempts: userData.loginAttempts,
      lastLoginAttempt: userData.lastLoginAttempt || undefined,
      blockedUntil: userData.blockedUntil || undefined,
      lastLogin: userData.lastLogin || undefined,
      emailVerified: userData.emailVerified,
      emailVerifiedAt: userData.emailVerifiedAt || undefined,
      verificationToken: userData.verificationToken || undefined,
      resetToken: userData.resetToken || undefined,
      resetTokenExpiry: userData.resetTokenExpiry || undefined,
      createdAt: userData.createdAt,
      createdBy: userData.createdBy || undefined,
      updatedAt: userData.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!userData) return null;

    return UserFactory.reconstitute({
      id: userData.id,
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
      role: userData.role as UserRole,
      status: userData.status as UserStatus,
      cedula: userData.cedula || undefined,
      telefono: userData.telefono || undefined,
      direccion: userData.direccion || undefined,
      loginAttempts: userData.loginAttempts,
      lastLoginAttempt: userData.lastLoginAttempt || undefined,
      blockedUntil: userData.blockedUntil || undefined,
      lastLogin: userData.lastLogin || undefined,
      emailVerified: userData.emailVerified,
      emailVerifiedAt: userData.emailVerifiedAt || undefined,
      verificationToken: userData.verificationToken || undefined,
      resetToken: userData.resetToken || undefined,
      resetTokenExpiry: userData.resetTokenExpiry || undefined,
      createdAt: userData.createdAt,
      createdBy: userData.createdBy || undefined,
      updatedAt: userData.updatedAt,
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    return !!user;
  }

  async existsByCedula(cedula: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { cedula },
    });

    return !!user;
  }

  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email.value,
        password: user.password.value,
        fullName: user.fullName,
        role: user.role as any,
        status: user.status as any,
        cedula: user.cedula,
        telefono: user.telefono,
        direccion: user.direccion,
        loginAttempts: user.loginAttempts,
        lastLoginAttempt: user.lastLoginAttempt,
        blockedUntil: user.blockedUntil,
        lastLogin: user.lastLogin,
        emailVerified: user.emailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        verificationToken: user.verificationToken,
        resetToken: user.resetToken,
        resetTokenExpiry: user.resetTokenExpiry,
        updatedAt: user.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
