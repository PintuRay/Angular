import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { LedgerBalance } from "./ledgerBalance";
import { SubLedger } from "./subLedger";

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
  
  export class SubLedgerBalance extends SubLedgerBalanceModel {
    subLedgerBalanceId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    subLedger: SubLedger = new SubLedger();
    branch: Branch = new Branch();
    financialYear: FinancialYear = new FinancialYear();
    ledgerBalance: LedgerBalance = new LedgerBalance();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  