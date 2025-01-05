import { ProductionTransaction } from "./productionTransaction";

export class ProductionOrderModel {
    fk_FinishedGoodId: string = '';
    productionTransactions: ProductionTransaction[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class ProductionOrder extends ProductionOrderModel {
    productionOrderId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  