export class SubLedgerModel {
    fk_LedgerId: string = '';
    fk_BranchId?: string;
    subLedgerName: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class SubLedgerUpdateModel extends SubLedgerModel {
    subLedgerId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class SubLedgerDto extends SubLedgerUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  