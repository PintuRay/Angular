
export class LabourTransactionModel {
    transactionNo: string = '';
    transactionDate: Date = new Date();
    fk_LabourOdrId: string = '';
    fk_ProductId: string = '';
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    quantity: number = 0;
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class LabourTransactionUpdateModel extends LabourTransactionModel {
    labourTransactionId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class LabourTransactionDto extends LabourTransactionUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  