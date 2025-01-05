import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { ProductType } from "./productType";
import { PurchaseReturnTransaction } from "./purchaseReturnTransaction";
import { SubLedger } from "./subLedger";

export class PurchaseReturnOrderModel {
    fkProductTypeId: string = '';
    transactionNo: string = '';
    fkSubLedgerId: string = '';
    fkBranchId: string = '';
    fkFinancialYearId: string = '';
    transactionDate: Date = new Date();
    invoiceNo: string = '';
    invoiceDate: Date = new Date();
    transportationCharges: number = 0;
    subTotal: number = 0;
    discount: number = 0;
    grandTotal: number = 0;
    gst: number = 0;
    transpoterName: string = '';
    vehicleNo?: string;
    receivingPerson?: string;
    narration?: string;
    purchaseReturnTransactions: PurchaseReturnTransaction[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class PurchaseReturnOrder extends PurchaseReturnOrderModel {
    purchaseReturnOrderId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    subLedger: SubLedger = new SubLedger();
    branch: Branch = new Branch();
    financialYear: FinancialYear = new FinancialYear();
    productType: ProductType = new ProductType();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  