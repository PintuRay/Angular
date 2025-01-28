import { SalesTransactionDto, SalesTransactionModel, SalesTransactionUpdateModel } from "./salesTransaction";

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
    salesTransactions: SalesTransactionModel[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class SalesOrderUpdateModel extends SalesOrderModel {
    salesOrderId: string = '';
    override salesTransactions: SalesTransactionUpdateModel[] = [];
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }

  export class SalesOrderDto extends SalesOrderUpdateModel {
    override salesTransactions: SalesTransactionDto[] = [];
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  