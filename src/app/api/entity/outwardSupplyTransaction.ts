import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { OutwardSupplyOrder } from "./outwardSupplyOrder";
import { Product } from "./product";

export class OutwardSupplyTransactionModel {
    fk_OutwardSupplyOrderId: string = '';
    transactionNo: string = '';
    transactionDate: Date = new Date();
    fk_ProductId: string = '';
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    quantity: number = 0;
    rate: number = 0;
    amount: number = 0;
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class OutwardSupplyTransaction extends OutwardSupplyTransactionModel {
    outwardSupplyTransactionId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    outwardSupplyOrder: OutwardSupplyOrder = new OutwardSupplyOrder();
    product: Product = new Product();
    branch: Branch = new Branch();
    financialYear: FinancialYear = new FinancialYear();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  