import { Email } from './Email';
import { Password } from './Password';

export enum UserRole {
  CLIENTE = 'CLIENTE',
  ASISTENTE = 'ASISTENTE',
  GERENTE = 'GERENTE',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  BLOCKED = 'BLOCKED',
}


export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public password: Password,
    public readonly fullName: string,
    public readonly role: UserRole,
    public status: UserStatus,
    public readonly cedula?: string,
    public readonly telefono?: string,
    public readonly direccion?: string,
    public loginAttempts: number = 0,
    public lastLoginAttempt?: Date,
    public blockedUntil?: Date,
    public lastLogin?: Date,
    public emailVerified: boolean = false,
    public emailVerifiedAt?: Date,
    public verificationToken?: string,
    public resetToken?: string,
    public resetTokenExpiry?: Date,
    public readonly createdAt: Date = new Date(),
    public readonly createdBy?: string,
    public updatedAt: Date = new Date()
  ) {}
}
