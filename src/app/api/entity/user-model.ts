import { AddressDto, AddressModel, AddressUpdateModel } from "src/app/api/entity/address";

export class UserDto {
  id: string;
  name: string;
  birthDate: Date;
  maratialStatus: string;
  gender: string;
  email: string;
  phoneNumber: string;
  photoPath: string;
  fk_AddressId: string;
  address: AddressDto;
  constructor() {
    this.id = '';
    this.name = '';
    this.birthDate = new Date();
    this.maratialStatus = '';
    this.gender = ''
    this.email = '';
    this.phoneNumber = '';
    this.photoPath = '';
    this.fk_AddressId = '';
    this.address = new AddressDto();
  }
}

export class UserModel {
  fk_TokenId: string;
  name: string;
  birthDate: Date;
  maratialStatus: string;
  gender: string;
  email: string;
  phoneNumber: string;
  photoPath: string;
  profilePhoto: File | null;
  password: string;
  confirmPassword: string;
  routeUls: string;
  fk_AddressId: string;
  address: AddressModel;
  constructor() {
    this.fk_TokenId = '';
    this.name = '';
    this.birthDate = new Date();
    this.maratialStatus = '';
    this.gender = ''
    this.email = '';
    this.phoneNumber = '';
    this.photoPath = '';
    this.profilePhoto = new File([], '');
    this.password = '';
    this.confirmPassword = '';
    this.routeUls = '';
    this.fk_AddressId = '';
    this.address = new AddressModel();
  }
}
export class UserUpdateModel {
  id: string;
  name: string;
  birthDate: Date;
  maratialStatus: string;
  gender: string;
  email: string;
  phoneNumber: string;
  photoPath: string;
  profilePhoto: File | null;
  address: AddressUpdateModel;
  constructor() {
    this.id = '';
    this.name = '';
    this.birthDate = new Date();
    this.maratialStatus = '';
    this.gender = ''
    this.email = '';
    this.phoneNumber = '';
    this.photoPath = '';
    this.profilePhoto = new File([], '');
    this.address = new AddressUpdateModel();
  }
}