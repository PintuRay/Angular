export class ChangePasswordModel {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    constructor(){
     this.currentPassword='';
     this.newPassword='';
     this.confirmNewPassword='';
    }
}