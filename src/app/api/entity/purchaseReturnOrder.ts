import { PurchaseReturnTransactionDto, PurchaseReturnTransactionModel, PurchaseReturnTransactionUpdateModel } from "./purchaseReturnTransaction";

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
    purchaseReturnTransactions: PurchaseReturnTransactionModel[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class PurchaseReturnOrderUpdateModel extends PurchaseReturnOrderModel {
    purchaseReturnOrderId: string = '';
    override purchaseReturnTransactions: PurchaseReturnTransactionUpdateModel[] = [];
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class PurchaseReturnOrderDto extends PurchaseReturnOrderUpdateModel {
    override purchaseReturnTransactions: PurchaseReturnTransactionDto[] = [];
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  