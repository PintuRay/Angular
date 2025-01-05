import { AlternateUnit } from "./alternateUnit";
import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { Product } from "./product";
import { PurchaseOrder } from "./purchaseOrder";

export class PurchaseTransactionModel {
    fkPurchaseOrderId: string = '';
    transactionNo: string = '';
    transactionDate: Date = new Date();
    fkProductId: string = '';
    fkBranchId: string = '';
    fkFinancialYearId: string = '';
    alternateQuantity: number = 0;
    fkAlternateUnitId: string = '';
    unitQuantity: number = 0;
    rate: number = 0;
    discount: number = 0;
    discountAmount: number = 0;
    gst: number = 0;
    gstAmount: number = 0;
    amount: number = 0;
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class PurchaseTransaction extends PurchaseTransactionModel {
    purchaseId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    branch: Branch = new Branch();
    financialYear: FinancialYear = new FinancialYear();
    purchaseOrder: PurchaseOrder = new PurchaseOrder();
    product: Product = new Product();
    alternateUnit: AlternateUnit = new AlternateUnit();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  