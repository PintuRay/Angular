export class BranchDto {
  branchId:string ;
  branchName: string;
  branchAddress: string;
  contactNumber: string;
  branchCode: string;
  constructor() {
    this.branchId = '';
    this.branchName = '';
    this.branchAddress = '';
    this.contactNumber = '';
    this.branchCode = '';
  }
}
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
