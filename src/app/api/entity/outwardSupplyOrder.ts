import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { OutwardSupplyTransaction } from "./outwardSupplyTransaction";
import { ProductType } from "./productType";

export class OutwardSupplyOrderModel {
    transactionNo: string = '';
    transactionDate: Date = new Date();
    toBranch: string = '';
    fk_ProductTypeId: string = '';
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    totalAmount: number = 0;
    outwardSupplyTransactions: OutwardSupplyTransaction[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class OutwardSupplyOrder extends OutwardSupplyOrderModel {
    outwardSupplyOrderId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    branch: Branch = new Branch();
    financialYear: FinancialYear = new FinancialYear();
    productType: ProductType = new ProductType();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  