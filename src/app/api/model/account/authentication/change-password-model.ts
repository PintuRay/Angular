export class ChangePasswordModel {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    constructor(){
     this.currentPassword='';
     this.newPassword='';
     this.confirmNewPassword='';
    }
    isValid(): boolean {
        return !!( this.newPassword && this.confirmNewPassword && this.newPassword === this.confirmNewPassword );
      }
    
      passwordsMatch(): boolean {
        return this.newPassword === this.confirmNewPassword;
      }
}