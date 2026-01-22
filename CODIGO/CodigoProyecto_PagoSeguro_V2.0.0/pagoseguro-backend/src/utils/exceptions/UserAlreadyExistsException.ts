import { DomainException } from "./DomainException";

export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`El email ${email} ya está registrado`);
    this.name = 'UserAlreadyExistsException';
  }
}
