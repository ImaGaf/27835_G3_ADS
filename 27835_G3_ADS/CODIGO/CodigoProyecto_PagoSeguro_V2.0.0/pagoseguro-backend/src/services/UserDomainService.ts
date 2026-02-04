import { IUserRepository, IEmailService } from '../lib/interfaces';
import { 
  UserAlreadyExistsException, 
  DomainException 
} from '../utils/exceptions';
import { User } from '../models/User';
import { UserStateService } from './UserStateService';

export class UserDomainService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  async validateNewUser(email: string, cedula: string): Promise<void> {
    if (await this.userRepository.existsByEmail(email)) {
      throw new UserAlreadyExistsException(email);
    }

    if (await this.userRepository.existsByCedula(cedula)) {
      throw new UserAlreadyExistsException(cedula);
    }
  }

  async verifyUserCanLogin(user: User): Promise<void> {
    if (UserStateService.isBlocked(user)) {
      throw new DomainException(
        `Cuenta bloqueada hasta ${user.blockedUntil?.toLocaleString()}`
      );
    }
  }

  async handleFailedLoginAttempt(user: User): Promise<void> {
    UserStateService.incrementLoginAttempts(user);
    
    if (UserStateService.isBlocked(user) && user.blockedUntil) {
      try {
        await this.emailService.sendAccountBlockedEmail(
          user.email.value,
          user.fullName,
          user.blockedUntil
        );
      } catch (error) {
        console.error('Error enviando email de bloqueo:', error);
      }
    }

    await this.userRepository.update(user);
  }

  async handleSuccessfulLogin(user: User): Promise<void> {
    UserStateService.updateLastLogin(user);
    await this.userRepository.update(user);
  }

  async sendVerificationEmail(
    email: string,
    token: string,
    fullName: string
  ): Promise<void> {
    try {
      await this.emailService.sendVerificationEmail(email, token, fullName);
    } catch (error) {
      console.error('Error enviando email de verificación:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetCode: string,
    fullName: string
  ): Promise<void> {
    try {
      await this.emailService.sendPasswordResetEmail(email, resetCode, fullName);
    } catch (error) {
      console.error('Error enviando email de recuperación:', error);
      throw error;
    }
  }
}
