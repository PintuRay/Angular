import { SalesTransactionSetupDto, SalesTransactionSetupModel, SalesTransactionSetupUpdateModel } from "./salesTransactionSetup";

export class SalesOrderSetupModel {
    fk_FinishedGoodId: string = '';
    salesTransactionSetups: SalesTransactionSetupModel[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class SalesOrderSetupUpdateModel extends SalesOrderSetupModel {
    salesOrderSetupId: string = '';
    override salesTransactionSetups: SalesTransactionSetupUpdateModel[] = [];
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class SalesOrderSetupDto extends SalesOrderSetupUpdateModel {
    override salesTransactionSetups: SalesTransactionSetupDto[] = [];
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  