import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { Product } from "./product";
import { SalesReturnOrder } from "./salesReturnOrder";

export class SalesReturnTransactionModel {
    fk_SalesReturnOrderId: string = '';
    transactionNo: string = '';
    transactionDate: Date = new Date();
    transactionType: string = '';
    fk_ProductId: string = '';
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    quantity: number = 0;
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
  
  export class SalesReturnTransaction extends SalesReturnTransactionModel {
    salesReturnId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    salesReturnOrder: SalesReturnOrder = new SalesReturnOrder();
    product: Product = new Product();
    branch: Branch = new Branch();
    financialYear: FinancialYear = new FinancialYear();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  