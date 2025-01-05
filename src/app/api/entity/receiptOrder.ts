import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { ReceiptTransaction } from "./receiptTransaction";

export class ReceiptOrderModel {
    voucherNo: string = '';
    voucherDate: Date = new Date();
    chequeNo?: string;
    chequeDate?: Date;
    cashBank?: string;
    cashBankLedgerId?: string;
    narration: string = '';
    totalAmount: number = 0;
    drCr: string = '';
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    receiptTransactions: ReceiptTransaction[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class ReceiptOrder extends ReceiptOrderModel {
    receiptOrderId: string = '';
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
  