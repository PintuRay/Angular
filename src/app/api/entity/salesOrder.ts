import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { SalesTransaction } from "./salesTransaction";
import { SubLedger } from "./subLedger";

export class SalesOrderModel {
    transactionNo: string = '';
    transactionType: string = '';
    priceType: string = '';
    fk_SubLedgerId?: string;
    customerName?: string;
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    transactionDate: Date = new Date();
    orderNo: string = '';
    orderDate: Date = new Date();
    subTotal: number = 0;
    discount: number = 0;
    gst: number = 0;
    grandTotal: number = 0;
    transpoterName: string = '';
    vehicleNo?: string;
    receivingPerson?: string;
    narration?: string;
    salesTransactions: SalesTransaction[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class SalesOrder extends SalesOrderModel {
    salesOrderId: string = '';
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
  