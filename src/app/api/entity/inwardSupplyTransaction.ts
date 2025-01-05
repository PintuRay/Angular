import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { InwardSupplyOrder } from "./inwardSupplyOrder";
import { Product } from "./product";

export class InwardSupplyTransactionModel
{
    fk_InwardSupplyOrderId: string;
    transactionNo: string;
    transactionDate: Date;
    fk_ProductId: string;
    fk_BranchId: string;
    fk_FinancialYearId: string;
    quantity: number;
    rate: number;
    amount: number;

    constructor() {
        this.fk_InwardSupplyOrderId = '';
        this.transactionNo = '';
        this.transactionDate = new Date();
        this.fk_ProductId = '';
        this.fk_BranchId = '';
        this.fk_FinancialYearId = '';
        this.quantity = 0;
        this.rate = 0;
        this.amount = 0;
    }
}
export class  InwardSupplyTransaction extends InwardSupplyTransactionModel{
    inwardSupplyTransactionId: string; 
    isActive?: boolean; 
    createdDate?: Date; 
    modifyDate?: Date; 
    createdBy?: string; 
    modifyBy?: string; 
    inwardSupplyOrder?: InwardSupplyOrder;
    product?: Product; 
    branch?: Branch; 
    financialYear?: FinancialYear; 

    constructor() {
        super();
        this.inwardSupplyTransactionId = '';
        this.isActive = true; 
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = ''; 
        this.modifyBy = ''; 
        this.inwardSupplyOrder=new InwardSupplyOrder();
        this.product= new Product(); 
        this.branch=new Branch(); 
        this.financialYear= new FinancialYear(); 
    }
}