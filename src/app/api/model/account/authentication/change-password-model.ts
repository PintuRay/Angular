export class ChangePasswordModel {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  constructor() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }
  /*--------------------------------------------------------------------------------*/
  private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;
  isValid(): boolean {
    return !!(this.newPassword && this.confirmNewPassword && this.newPassword === this.confirmNewPassword && this.isPasswordValid());
  }
  isPasswordValid(): boolean {
    return this.passwordPattern.test(this.newPassword);
  }
  passwordMatch(): boolean {
    return this.newPassword === this.confirmNewPassword;
  }
}