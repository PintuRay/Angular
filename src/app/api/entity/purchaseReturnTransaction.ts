import { AlternateUnit } from "./alternateUnit";
import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { Product } from "./product";
import { PurchaseReturnOrder } from "./purchaseReturnOrder";

export class PurchaseReturnTransactionModel {
    fk_PurchaseReturnOrderId: string = '';
    transactionNo: string = '';
    transactionDate: Date = new Date();
    fk_ProductId: string = '';
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    alternateQuantity: number = 0;
    fk_AlternateUnitId: string = '';
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
  export class PurchaseReturnTransaction extends PurchaseReturnTransactionModel {
    purchaseReturnId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    branch: Branch = new Branch();
    financialYear: FinancialYear = new FinancialYear();
    purchaseReturnOrder: PurchaseReturnOrder = new PurchaseReturnOrder();
    product: Product = new Product();
    alternateUnit: AlternateUnit = new AlternateUnit();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  