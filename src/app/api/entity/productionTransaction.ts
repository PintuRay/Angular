export class ProductionTransactionModel {
    fk_ProductionOrderId: string = '';
    fk_RawMaterialId: string = '';
    quantity: number = 0;
    unit: string = '';
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class ProductionTransactionUpdateModel extends ProductionTransactionModel {
    productionTransactionId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class ProductionTransactionDto extends ProductionTransactionUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  