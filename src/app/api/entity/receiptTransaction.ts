export class ReceiptTransactionModel {
    fk_ReceiptOrderId: string = '';
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
  
  export class ReceiptTransactionUpdateModel extends ReceiptTransactionModel {
    receiptId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class ReceiptTransactionDto extends ReceiptTransactionUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  