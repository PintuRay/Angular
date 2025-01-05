import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { ProductType } from "./productType";
import { PurchaseTransaction } from "./purchaseTransaction";
import { SubLedger } from "./subLedger";

export class PurchaseOrderModel {
    transactionNo: string = '';
    fk_ProductTypeId: string = '';
    fk_SubLedgerId: string = '';
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    transactionDate: Date = new Date();
    invoiceNo: string = '';
    invoiceDate: Date = new Date();
    subTotal: number = 0;
    discount: number = 0;
    gst?: number;
    transportationCharges: number = 0;
    grandTotal: number = 0;
    transpoterName: string = '';
    vehicleNo?: string;
    narration?: string;
    receivingPerson?: string;
    purchaseTransactions: PurchaseTransaction[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class PurchaseOrder extends PurchaseOrderModel {
    purchaseOrderId: string = '';
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
  