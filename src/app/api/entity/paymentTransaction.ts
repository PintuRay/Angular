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
  
  export class PaymentTransactionUpdateModel extends PaymentTransactionModel {
    paymentId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class PaymentTransactionDto extends PaymentTransactionUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  