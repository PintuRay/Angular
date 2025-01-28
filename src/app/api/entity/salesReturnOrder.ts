import { SalesReturnTransactionDto, SalesReturnTransactionModel, SalesReturnTransactionUpdateModel } from "./salesReturnTransaction";

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
    salesReturnTransactions: SalesReturnTransactionModel[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class SalesReturnOrderUpdateModel extends SalesReturnOrderModel {
    salesReturnOrderId: string = '';
    override salesReturnTransactions: SalesReturnTransactionUpdateModel[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class SalesReturnOrderDto extends SalesReturnOrderUpdateModel {
    override salesReturnTransactions: SalesReturnTransactionDto[] = [];
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  