import { Branch } from "./branch";
import { DamageOrder } from "./damageOrder";
import { FinancialYear } from "./financialYear";
import { Product } from "./product";

export class DamageTransactionModel
{
    fk_DamageOrderId: string;
    transactionNo: string;
    transactionDate: Date;
    fk_ProductId: string; 
    fk_BranchId: string; 
    fk_FinancialYearId: string; 
    quantity: number; 
    rate: number; 
    amount: number;

    constructor() {
        this.fk_DamageOrderId = '';
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
export class  DamageTransaction extends DamageTransactionModel{
    damageTransactionId: string;
    isActive?: boolean; 
    createdDate?: Date; 
    modifyDate?: Date; 
    createdBy?: string; 
    modifyBy?: string; 
    damageOrder?: DamageOrder;
    product?: Product;
    branch?: Branch; 
    financialYear?: FinancialYear;

    constructor() {
        super();
        this.damageTransactionId = '';
        this.isActive = true; 
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = ''; 
        this.modifyBy = ''; 
        this.damageOrder= new DamageOrder();
        this.product= new Product();
        this.branch= new Branch(); 
        this.financialYear= new FinancialYear();
    }
}