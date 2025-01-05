export class StorageModel {
  email:string;
    jwtToken: string;
    twoFactorEnable: boolean;
    otpExpiredIn: Date;
    constructor() {
      this.email='';
      this.jwtToken = '';
      this.twoFactorEnable = false;
      this.otpExpiredIn = new Date();
    }
  }