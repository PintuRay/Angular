export class UserBranchModel {
    fk_UserId: string = '';
    fk_BranchId: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class UserBranchUpdateModel extends UserBranchModel {
    id: string = ''; 
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class UserBranchDto extends UserBranchUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  