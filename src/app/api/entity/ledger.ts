export class LedgerModel {
    ledgerName: string = '';
    ledgerType: string = '';
    hasSubLedger: string = '';
    fk_LedgerGroupId: string = '';
    fk_LedgerSubGroupId?: string;
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class LedgerUpdateModel extends LedgerModel {
    ledgerId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class LedgerDto extends LedgerUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  