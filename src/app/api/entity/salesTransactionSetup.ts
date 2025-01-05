import { SalesOrderSetup } from "./salesOrderSetup";

export class SalesTransactionSetupModel {
    fkSalesOrderSetupId: string = '';
    fkSubFinishedGoodId: string = '';
    quantity: number = 0;
    unit: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class SalesTransactionSetup extends SalesTransactionSetupModel {
    salesTransactionSetupId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    salesOrderSetup: SalesOrderSetup = new SalesOrderSetup();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  