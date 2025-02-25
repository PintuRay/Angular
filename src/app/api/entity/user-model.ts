import { AddressDto, AddressModel, AddressUpdateModel } from "src/app/api/entity/address";

export class UserBase {
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

export class UserModel extends UserBase {
  fk_TokenId: string;
  password: string;
  confirmPassword: string;
  routeUls: string;
  profilePhoto: File | null;
  address: AddressModel;
  constructor() {
    super();
    this.fk_TokenId = '';
    this.profilePhoto = new File([], '');
    this.password = '';
    this.confirmPassword = '';
    this.routeUls = '';
    this.address = new AddressModel();
  }
}

export class UserUpdateModel extends UserBase {
  id: string;
  profilePhoto: File | null;
  address: AddressUpdateModel;
  constructor() {
    super();
    this.id = '';
    this.profilePhoto = new File([], '');
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
/*===========================================Auto Mapping======================================================*/
export class UserMapper {
  static dtoToUpdateModel(dto: UserDto): UserUpdateModel {
    const updateModel = new UserUpdateModel();
    Object.assign(updateModel, {
      id: dto.id,
      name: dto.name,
      birthDate: dto.birthDate,
      maratialStatus: dto.maratialStatus,
      gender: dto.gender,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      photoPath: dto.photoPath,
      profilePhoto: null,
      address: {
        fk_CountryId: dto.address.fk_CountryId,
        fk_StateId: dto.address.fk_StateId,
        fk_DistId: dto.address.fk_DistId,
        at: dto.address.at,
        post: dto.address.post,
        city: dto.address.city,
        pinCode: dto.address.pinCode
      }
    });
    return updateModel;
  }
}