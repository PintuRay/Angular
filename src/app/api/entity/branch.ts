/*------------------------- Api Model----------------*/
export class BranchModel {
    branchName: string;
    branchAddress: string;
    contactNumber: string;
    branchCode: string;
    constructor() {
      this.branchName = '';
      this.branchAddress = '';
      this.contactNumber = '';
      this.branchCode = '';
    }
  }
  export class BranchUpdateModel extends BranchModel{
    branchId:string ;
    constructor() {
      super();
      this.branchId = '';
    }
  }
  export class BranchDto extends BranchUpdateModel{
    constructor() {
      super();
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
