import { PaymentTransactionDto, PaymentTransactionModel, PaymentTransactionUpdateModel } from "./paymentTransaction";

export class PaymentOrderModel {
    cashBank: string = '';
    chequeNo?: string;
    chequeDate?: Date;
    cashBankLedgerId?: string;
    vouvherNo: string = '';
    voucherDate: Date = new Date();
    narration: string = '';
    drCr: string = '';
    totalAmount: number = 0;
    fk_BranchId: string = '';
    fk_FinancialYearId: string = '';
    paymentTransactions: PaymentTransactionModel[] = [];
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class PaymentOrderUpdateModel extends PaymentOrderModel {
    paymentOrderId: string = '';
    override paymentTransactions: PaymentTransactionUpdateModel[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class PaymentOrderDto extends PaymentOrderUpdateModel {
    override paymentTransactions: PaymentTransactionDto[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  