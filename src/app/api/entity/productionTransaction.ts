import { ProductionOrder } from "./productionOrder";

export class ProductionTransactionModel {
    fk_ProductionOrderId: string = '';
    fk_RawMaterialId: string = '';
    quantity: number = 0;
    unit: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class ProductionTransaction extends ProductionTransactionModel {
    productionTransactionId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    productionOrder: ProductionOrder = new ProductionOrder();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  