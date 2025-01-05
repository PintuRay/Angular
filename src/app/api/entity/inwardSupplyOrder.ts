import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";
import { InwardSupplyTransaction } from "./inwardSupplyTransaction";
import { ProductType } from "./productType";

export class InwardSupplyOrderModel
{
    transactionNo: string;
    transactionDate: Date;
    fromBranch: string; 
    fk_ProductTypeId: string;
    fk_BranchId: string; 
    fk_FinancialYearId: string;
    totalAmount: number; 
    inwardSupplyTransactions?: InwardSupplyTransaction[]; 

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
export class  InwardSupplyOrder extends InwardSupplyOrderModel{
    inwardSupplyOrderId: string; 
    isActive?: boolean; 
    createdDate?: Date; 
    modifyDate?: Date;
    createdBy?: string; 
    modifyBy?: string; 
    branch?: Branch; 
    financialYear?: FinancialYear; 
    productType?: ProductType; 

    constructor() {
        super();
        this.inwardSupplyOrderId = '';
        this.isActive = true; 
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = ''; 
        this.modifyBy = ''; 
        this.branch= new Branch(); 
        this.financialYear=new FinancialYear(); 
        this.productType= new ProductType(); 
    }
}