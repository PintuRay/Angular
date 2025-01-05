import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { Ledger } from "./ledger";
import { LedgerDev } from "./ledgerDev";
import { LedgerGroup } from "./ledgerGroup";
import { PaymentOrder } from "./paymentOrder";
import { SubLedger } from "./subLedger";

export class PaymentTransactionModel {
    fk_PaymentOrderId: string = '';
    fk_LedgerGroupId: string = '';
    fk_LedgerId: string = '';
    fk_SubLedgerId?: string;
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    amount: number = 0;
    drCr: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class PaymentTransaction extends PaymentTransactionModel {
    paymentId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    ledgerGroup: LedgerGroup = new LedgerGroup();
    ledger: Ledger = new Ledger();
    ledgerDev: LedgerDev = new LedgerDev();
    subLedger: SubLedger = new SubLedger();
    branch: Branch = new Branch();
    financialYear: FinancialYear = new FinancialYear();
    paymentOrder: PaymentOrder = new PaymentOrder();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  