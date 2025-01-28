export class StockModel {
    fk_BranchId: string = '';
    fk_ProductId: string = '';
    fk_FinancialYear: string = '';
    minQty: number = 0;
    maxQty: number = 0;
    openingStock: number = 0;
    rate: number = 0;
    amount: number = 0;
    availableStock: number = 0;
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class StockUpdateModel extends StockModel {
    stockId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class StockDto extends StockUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  