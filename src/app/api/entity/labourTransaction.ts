import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { LabourOrder } from "./labourOrder";
import { Product } from "./product";

export class LabourTransactionModel {
    transactionNo: string = '';
    transactionDate: Date = new Date();
    fk_LabourOdrId: string = '';
    fk_ProductId: string = '';
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    quantity: number = 0;
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class LabourTransaction extends LabourTransactionModel {
    labourTransactionId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    labourOrder: LabourOrder = new LabourOrder();
    product: Product = new Product();
    financialYear: FinancialYear = new FinancialYear();
    branch: Branch = new Branch();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  