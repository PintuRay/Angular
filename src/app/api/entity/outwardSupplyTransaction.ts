export class OutwardSupplyTransactionModel {
    fk_OutwardSupplyOrderId: string = '';
    transactionNo: string = '';
    transactionDate: Date = new Date();
    fk_ProductId: string = '';
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    quantity: number = 0;
    rate: number = 0;
    amount: number = 0;
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class OutwardSupplyTransactionUpdateModel extends OutwardSupplyTransactionModel {
    outwardSupplyTransactionId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class OutwardSupplyTransactionDto extends OutwardSupplyTransactionUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  