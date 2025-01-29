import { AddressDto, AddressModel, AddressUpdateModel } from "src/app/api/entity/address";
export class UserBase{
  name: string;
  birthDate: Date;
  maratialStatus: string;
  gender: string;
  email: string;
  phoneNumber: string;
  photoPath: string;
  constructor() {
    this.name = '';
    this.birthDate = new Date();
    this.maratialStatus = '';
    this.gender = ''
    this.email = '';
    this.phoneNumber = '';
    this.photoPath = '';
  }
}
export class UserModel extends UserBase{
  fk_TokenId: string;
  password: string;
  confirmPassword: string;
  routeUls: string;
  profilePhoto: File | null;
  fk_AddressId: string;
  address: AddressModel;
  constructor() {
    super();
    this.fk_TokenId = '';
    this.profilePhoto = new File([], '');
    this.password = '';
    this.confirmPassword = '';
    this.routeUls = '';
    this.fk_AddressId = '';
    this.address = new AddressModel();
  }
}

export class UserUpdateModel extends UserBase {
  id: string;
  profilePhoto: File | null;
  fk_AddressId: string;
  address: AddressUpdateModel;
  constructor() {
    super();
    this.id = '';
    this.profilePhoto = new File([], '');
    this.fk_AddressId = '';
    this.address = new AddressUpdateModel();
  }
}
export class UserDto extends UserBase {
  id: string;
 address: AddressDto;
  constructor() {
    super();
    this.id = '';
    this.address = new AddressDto();
  }
}