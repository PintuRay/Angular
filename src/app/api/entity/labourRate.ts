import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { Product } from "./product";
import { ProductType } from "./productType";

export class LabourRateModel {
    fk_FinancialYearId: string = '';
    date: Date = new Date();
    fk_ProductTypeId: string = '';
    fk_ProductId: string = '';
    fk_BranchId?: string;
    rate: number = 0;
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class LabourRate extends LabourRateModel {
    labourRateId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    productType: ProductType = new ProductType();
    product: Product = new Product();
    branch: Branch = new Branch();
    financialYear: FinancialYear = new FinancialYear();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  