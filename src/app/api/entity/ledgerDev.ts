export class LedgerDevModel {
    ledgerName: string = '';
    ledgerType: string = '';
    hasSubLedger: string = '';
    fk_LedgerGroupId: string = '';
    fk_LedgerSubGroupId?: string;
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  export class LedgerDevUpdateModel extends LedgerDevModel {
    ledgerId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class LedgerDevDto extends LedgerDevUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  