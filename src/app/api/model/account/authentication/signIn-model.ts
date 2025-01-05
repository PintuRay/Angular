export class SignInModel {
    email: string;
    password: string;
    rememberMe: boolean;
    constructor() {
      this.email = '';
      this.password = '';
      this.rememberMe = false;
    }
  } 
  