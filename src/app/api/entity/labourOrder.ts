import { LabourTransactionDto, LabourTransactionModel, LabourTransactionUpdateModel } from "./labourTransaction";

export class LabourOrderModel {
    transactionNo: string = '';
    transactionDate: Date = new Date();
    fk_ProductId: string = '';
    fk_LabourId: string = '';
    fk_LabourTypeId: string = '';
    fk_FinancialYearId: string = '';
    fkBranchId: string = '';
    quantity: number = 0;
    rate: number = 0;
    amount: number = 0;
    otAmount: number = 0;
    narration: string = '';
    labourTransactions: LabourTransactionModel[] = [];
    constructor() {

    }
  }
  
  export class LabourOrderUpdateModel extends LabourOrderModel {
    labourOrderId: string = '';
    override labourTransactions: LabourTransactionUpdateModel[] = [];
    constructor() {
      super();

    }
  }
  export class LabourOrderDto extends LabourOrderUpdateModel {
    override labourTransactions: LabourTransactionDto[] = [];
    constructor() {
      super();
    }
  }
  
