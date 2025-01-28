export class LedgerSubGroupDevModel {
    fk_LedgerGroupId: string = '';
    fk_BranchId: string = '';
    subGroupName: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class LedgerSubGroupDevUpdateModel extends LedgerSubGroupDevModel {
    ledgerSubGroupId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class LedgerSubGroupDevDto extends LedgerSubGroupDevUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  