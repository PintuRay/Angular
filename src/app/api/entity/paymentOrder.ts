import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { PaymentTransaction } from "./paymentTransaction";

export class PaymentOrderModel {
    cashBank: string = '';
    chequeNo?: string;
    chequeDate?: Date;
    cashBankLedgerId?: string;
    vouvherNo: string = '';
    voucherDate: Date = new Date();
    narration: string = '';
    drCr: string = '';
    totalAmount: number = 0;
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    paymentTransactions: PaymentTransaction[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class PaymentOrder extends PaymentOrderModel {
    paymentOrderId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    branch: Branch = new Branch();
    financialYear: FinancialYear = new FinancialYear();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  