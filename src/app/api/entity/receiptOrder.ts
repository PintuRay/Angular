import {ReceiptTransactionDto, ReceiptTransactionModel, ReceiptTransactionUpdateModel } from "./receiptTransaction";

export class ReceiptOrderModel {
    voucherNo: string = '';
    voucherDate: Date = new Date();
    chequeNo?: string;
    chequeDate?: Date;
    cashBank?: string;
    cashBankLedgerId?: string;
    narration: string = '';
    totalAmount: number = 0;
    drCr: string = '';
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    receiptTransactions: ReceiptTransactionModel[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class ReceiptOrderUpdateModel extends ReceiptOrderModel {
    receiptOrderId: string = '';
    override receiptTransactions: ReceiptTransactionUpdateModel[] = [];
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class ReceiptOrderDto extends ReceiptOrderUpdateModel {
    override receiptTransactions: ReceiptTransactionDto[] = [];
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }