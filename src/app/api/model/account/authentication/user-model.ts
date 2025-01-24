import { AddressModel } from "src/app/api/entity/address";

export class UserModel {
    id: string;
    name: string;
    birthDate: Date;
    maratialStatus:string;
    gender:string ;
    email: string;
    phoneNumber: string;
    profilePhoto: File;
    photoPath:string;
    address: AddressModel;
    constructor() {
      this.id ='';
      this.name = '';
      this.birthDate = new Date();
      this.maratialStatus='';
      this.gender =''
      this.email = '';
      this.phoneNumber = '';
      this.photoPath = '';
      this.profilePhoto = new File([], '') ;
      this.address = new AddressModel();
    }
  }