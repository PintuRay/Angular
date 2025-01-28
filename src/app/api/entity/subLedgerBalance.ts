export class SubLedgerBalanceModel {
    fk_LedgerBalanceId: string = '';
    fk_SubLedgerId: string = '';
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    openingBalance: number = 0;
    openingBalanceType: string = '';
    runningBalance: number = 0;
    runningBalanceType: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class SubLedgerBalanceUpdateModel extends SubLedgerBalanceModel {
    subLedgerBalanceId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class SubLedgerBalanceDto extends SubLedgerBalanceUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }