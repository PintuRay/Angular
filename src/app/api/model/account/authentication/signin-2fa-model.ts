export class SignIn2faModel {
    public Email: string;
    public OTP: string;
  
    constructor() {
      this.Email = '';
      this.OTP = '';
    }
  }