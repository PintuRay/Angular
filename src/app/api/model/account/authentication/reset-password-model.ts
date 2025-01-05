export class ResetPasswordModel {
    newPassword: string;
    confirmNewPassword: string;
    constructor(){
        this.newPassword='';
        this.confirmNewPassword='';
    }
  }