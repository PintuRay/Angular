export class ResetPasswordModel {
    uid:string;
    token:string;
    newPassword: string;
    confirmNewPassword: string;
    constructor(){
        this.uid ='';
        this.token = '';
        this.newPassword='';
        this.confirmNewPassword='';
    }
/*--------------------------------------------------------------------------------*/
    private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;
   
    isValid(): boolean {
        return !!(
          this.uid &&
          this.token &&
          this.newPassword &&
          this.confirmNewPassword &&
          this.newPassword === this.confirmNewPassword &&
          this.isPasswordValid()
        );
      }
      isPasswordValid(): boolean {
        return this.passwordPattern.test(this.newPassword);
    }
      passwordsMatch(): boolean {
        return this.newPassword === this.confirmNewPassword;
      }
  }