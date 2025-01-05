import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { Ledger } from "./ledger";
import { LedgerDev } from "./ledgerDev";
import { SubLedgerBalance } from "./subLedgerBalance";

export class LedgerBalanceModel {
    fkLedgerId: string = '';
    fkBranchId: string = '';
    fkFinancialYear: string = '';
    openingBalance: number = 0;
    openingBalanceType: string = '';
    runningBalance: number = 0;
    runningBalanceType: string = '';
    subLedgerBalances: SubLedgerBalance[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class LedgerBalance extends LedgerBalanceModel {
    ledgerBalanceId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    ledger: Ledger = new Ledger();
    ledgerDev: LedgerDev = new LedgerDev();
    branch: Branch = new Branch();
    financialYear: FinancialYear = new FinancialYear();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
    