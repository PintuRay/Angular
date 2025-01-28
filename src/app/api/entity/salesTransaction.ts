export class SalesTransactionModel {
    fk_SalesOrderId: string = '';
    transactionNo: string = '';
    transactionDate: Date = new Date();
    transactionType: string = '';
    fk_ProductId: string = '';
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    quantity: number = 0;
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
  
  export class SalesTransactionUpdateModel extends SalesTransactionModel {
    salesId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class SalesTransactionDto extends SalesTransactionUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  