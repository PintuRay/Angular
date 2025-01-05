import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { SalesReturnTransaction } from "./salesReturnTransaction";
import { SubLedger } from "./subLedger";

export class SalesReturnOrderModel {
    transactionNo: string = '';
    transactionDate: Date = new Date();
    transactionType: string = '';
    priceType: string = '';
    fk_SubLedgerId?: string;
    customerName?: string;
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    orderNo: string = '';
    orderDate: Date = new Date();
    subTotal: number = 0;
    discount: number = 0;
    grandTotal: number = 0;
    gst: number = 0;
    transpoterName: string = '';
    vehicleNo?: string;
    receivingPerson?: string;
    narration?: string;
    salesReturnTransactions: SalesReturnTransaction[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class SalesReturnOrder extends SalesReturnOrderModel {
    salesReturnOrderId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    subLedger: SubLedger = new SubLedger();
    branch: Branch = new Branch();
    financialYear: FinancialYear = new FinancialYear();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  