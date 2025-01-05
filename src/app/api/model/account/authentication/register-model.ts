import { AddressModel } from "src/app/api/entity/address";

export class RegisterModel {
    fkTokenId: string;
    name: string;
    birthDate: Date;
    maratialStatus:string;
    genderId:string ;
    profilePhoto: File;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    routeUls: string;
    termCondition: boolean;
    Address: AddressModel;
    constructor() {
      this.fkTokenId = '';
      this.name = '';
      this.birthDate = new Date();
      this.maratialStatus='';
      this.genderId=''
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      this.phoneNumber = '';
      this.profilePhoto = new File([], '') ;
      this.routeUls = '';
      this.termCondition = false;
      this.Address = new AddressModel();
    }
  }
 
  // export class UserViewModel extends RegisterModel {
  //   id: string;
  //   emailConfirmationToken: string;
  //   otp: string;
  //   constructor() {
  //     super();
  //     this.id = '';
  //     this.emailConfirmationToken = '';
  //     this.otp = '';
  //   }
  // }