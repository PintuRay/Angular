export class PurchaseReturnTransactionModel {
    fk_PurchaseReturnOrderId: string = '';
    transactionNo: string = '';
    transactionDate: Date = new Date();
    fk_ProductId: string = '';
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    alternateQuantity: number = 0;
    fk_AlternateUnitId: string = '';
    unitQuantity: number = 0;
    rate: number = 0;
    discount: number = 0;
    discountAmount: number = 0;
    gst: number = 0;
    gstAmount: number = 0;
    amount: number = 0;
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  export class PurchaseReturnTransactionUpdateModel extends PurchaseReturnTransactionModel {
    purchaseReturnId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class PurchaseReturnTransactionDto extends PurchaseReturnTransactionUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  