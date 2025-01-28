import { InwardSupplyTransactionDto, InwardSupplyTransactionModel, InwardSupplyTransactionUpdateModel } from "./inwardSupplyTransaction";
export class InwardSupplyOrderModel
{
    transactionNo: string;
    transactionDate: Date;
    fromBranch: string; 
    fk_ProductTypeId: string;
    fk_BranchId: string; 
    fk_FinancialYearId: string;
    totalAmount: number; 
    inwardSupplyTransactions: InwardSupplyTransactionModel[]; 

    constructor() {
        this.transactionNo = '';
        this.transactionDate = new Date();
        this.fromBranch = '';
        this.fk_ProductTypeId = '';
        this.fk_BranchId = '';
        this.fk_FinancialYearId = '';
        this.totalAmount = 0;
        this.inwardSupplyTransactions = [];
    }
}
export class  InwardSupplyOrderUpdateModel extends InwardSupplyOrderModel{
    inwardSupplyOrderId: string; 
    override inwardSupplyTransactions: InwardSupplyTransactionUpdateModel[]; 
    constructor() {
        super();
        this.inwardSupplyOrderId = '';
        this.inwardSupplyTransactions = [];
    }
}
export class InwardSupplyOrderDto extends InwardSupplyOrderUpdateModel{
    override inwardSupplyTransactions: InwardSupplyTransactionDto[]; 
    constructor() {
super();
        this.inwardSupplyTransactions = [];
    }
}