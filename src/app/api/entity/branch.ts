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
    branchId:string ;
    override address: AddressUpdateModel;
    constructor() {
      super();
      this.branchId = '';
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
/*-------------------------opertion Model----------------*/
  export interface BranchOperation {
    branch: BranchDto | null;
    isSuccess?: boolean;
    message?: string;
  }

  export interface BulkBranchOperation {
    branches: BranchDto[] | null;
    isSuccess?: boolean;
  }
