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
    isValid(): boolean {
        return !!(
          this.uid &&
          this.token &&
          this.newPassword &&
          this.confirmNewPassword &&
          this.newPassword === this.confirmNewPassword
        );
      }
    
      passwordsMatch(): boolean {
        return this.newPassword === this.confirmNewPassword;
      }
  }