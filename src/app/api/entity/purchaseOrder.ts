import { PurchaseTransactionDto, PurchaseTransactionModel, PurchaseTransactionUpdateModel } from "./purchaseTransaction";

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
    purchaseTransactions: PurchaseTransactionModel[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class PurchaseOrderUpdateModel extends PurchaseOrderModel {
    purchaseOrderId: string = '';
   override  purchaseTransactions: PurchaseTransactionUpdateModel[] = [];
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class PurchaseOrderDto extends PurchaseOrderModel {
   override  purchaseTransactions: PurchaseTransactionDto[] = [];
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  