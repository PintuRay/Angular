import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { Labour } from "./labour";
import { LabourTransaction } from "./labourTransaction";
import { LabourType } from "./labourType";
import { Product } from "./product";

export class LabourOrderModel {
    transactionNo: string = '';
    transactionDate: Date = new Date();
    fk_ProductId: string = '';
    fk_LabourId: string = '';
    fk_LabourTypeId: string = '';
    fk_FinancialYearId: string = '';
    fkBranchId: string = '';
    quantity: number = 0;
    rate: number = 0;
    amount: number = 0;
    otAmount: number = 0;
    narration: string = '';
    labourTransactions: LabourTransaction[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class LabourOrder extends LabourOrderModel {
    labourOrderId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    product: Product = new Product();
    labour: Labour = new Labour();
    financialYear: FinancialYear = new FinancialYear();
    branch: Branch = new Branch();
    labourType: LabourType = new LabourType();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  
