import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { Product } from "./product";

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
  
  export class Stock extends StockModel {
    stockId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    branch: Branch = new Branch();
    product: Product = new Product();
    financialYear: FinancialYear = new FinancialYear();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  