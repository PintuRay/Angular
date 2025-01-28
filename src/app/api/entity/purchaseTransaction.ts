export class PurchaseTransactionModel {
    fkPurchaseOrderId: string = '';
    transactionNo: string = '';
    transactionDate: Date = new Date();
    fkProductId: string = '';
    fkBranchId: string = '';
    fkFinancialYearId: string = '';
    alternateQuantity: number = 0;
    fkAlternateUnitId: string = '';
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
  
  export class PurchaseTransactionUpdateModel extends PurchaseTransactionModel {
    purchaseId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class PurchaseTransactionDto extends PurchaseTransactionModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  