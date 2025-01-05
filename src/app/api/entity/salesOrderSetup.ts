import { SalesTransactionSetup } from "./salesTransactionSetup";

export class SalesOrderSetupModel {
    fk_FinishedGoodId: string = '';
    salesTransactionSetups: SalesTransactionSetup[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class SalesOrderSetup extends SalesOrderSetupModel {
    salesOrderSetupId: string = '';
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
  