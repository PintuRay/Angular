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
  }