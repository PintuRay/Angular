export class LedgerBalanceModel {
    fkLedgerId: string = '';
    fkBranchId: string = '';
    fkFinancialYear: string = '';
    openingBalance: number = 0;
    openingBalanceType: string = '';
    runningBalance: number = 0;
    runningBalanceType: string = '';
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class LedgerBalanceUpdateModel extends LedgerBalanceModel {
    ledgerBalanceId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class LedgerBalanceDto extends LedgerBalanceUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
    