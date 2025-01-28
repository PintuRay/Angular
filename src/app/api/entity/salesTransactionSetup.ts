export class SalesTransactionSetupModel {
    fkSalesOrderSetupId: string = '';
    fkSubFinishedGoodId: string = '';
    quantity: number = 0;
    unit: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class SalesTransactionSetupUpdateModel extends SalesTransactionSetupModel {
    salesTransactionSetupId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
    
  export class SalesTransactionSetupDto extends SalesTransactionSetupUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  