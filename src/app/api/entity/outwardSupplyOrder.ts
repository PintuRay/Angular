import { OutwardSupplyTransactionDto, OutwardSupplyTransactionModel, OutwardSupplyTransactionUpdateModel } from "./outwardSupplyTransaction";

export class OutwardSupplyOrderModel {
    transactionNo: string = '';
    transactionDate: Date = new Date();
    toBranch: string = '';
    fk_ProductTypeId: string = '';
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    totalAmount: number = 0;
    outwardSupplyTransactions: OutwardSupplyTransactionModel[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class OutwardSupplyOrderUpdateModel extends OutwardSupplyOrderModel {
    outwardSupplyOrderId: string = '';
    override outwardSupplyTransactions: OutwardSupplyTransactionUpdateModel[] = [];
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class OutwardSupplyOrderDto extends OutwardSupplyOrderUpdateModel {
    override outwardSupplyTransactions: OutwardSupplyTransactionDto[] = [];
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  