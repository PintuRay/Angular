import { AddressDto, AddressModel, AddressUpdateModel } from "./address";

/*------------------------- Api Model----------------*/
export class BranchModel {
    branchName: string;
    contactNumber: string;
    branchCode: string;
    address: AddressModel;
    constructor() {
      this.branchName = '';
      this.contactNumber = '';
      this.branchCode = '';
      this.address = new AddressModel();
    }
  }
  export class BranchUpdateModel extends BranchModel{
    branchId: string ;
    fk_AdressId: string;
    override address: AddressUpdateModel;
    constructor() {
      super();
      this.branchId = '';
      this.fk_AdressId = '';
      this.address = new AddressUpdateModel();
    }
  }
  export class BranchDto extends BranchUpdateModel{
    override address: AddressDto;
    constructor() {
      super();
      this.address = new AddressDto();
    }
  }
   /*===========================================Auto Mapping======================================================*/
   export class BranchMapper {
    static dtoToUpdateModel(dto: BranchDto): BranchUpdateModel {
      const updateModel = new BranchUpdateModel();
      Object.assign(updateModel, {
        branchId: dto.branchId,
        branchName: dto.branchName,
        contactNumber: dto.contactNumber,
        branchCode: dto.branchCode,
        fk_AdressId : dto.fk_AdressId,
        address:{
          addressId: dto.address.addressId,
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
/*=========================================== Opertion Model===========================================*/
  export interface BranchOperation {
    branch: BranchDto | null;
    isSuccess?: boolean;
    message?: string;
  }

  export interface BulkBranchOperation {
    branches: BranchDto[] | null;
    isSuccess?: boolean;
  }
 
