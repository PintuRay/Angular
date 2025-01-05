import { Branch } from './branch';
import { DamageTransaction } from './damageTransaction';
import { FinancialYear } from './financialYear';
import { Labour } from './labour';
import { ProductType } from './productType';

export class DamageOrderModel {
    transactionNo: string;
    transactionDate: Date;
    fk_ProductTypeId: string;
    fk_LabourId?: string;
    fk_BranchId: string;
    fk_FinancialYearId: string;
    totalAmount: number;
    reason?: string;
    damageTransactions?: DamageTransaction[];
    constructor() {
        this.transactionNo = '';
        this.transactionDate = new Date();
        this.fk_ProductTypeId = '';
        this.fk_LabourId = undefined;
        this.fk_BranchId = '';
        this.fk_FinancialYearId = '';
        this.totalAmount = 0;
        this.reason = '';
        this.damageTransactions = [];
    }
}
export class DamageOrder extends DamageOrderModel {
    damageOrderId: string;
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string;
    modifyBy?: string;
    branch?: Branch;
    financialYear?: FinancialYear;
    productType?: ProductType;
    labour?: Labour;

    constructor() {
        super();
        this.damageOrderId = '';
        this.isActive = true; 
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = '';
        this.modifyBy = '';
        this.branch = new Branch();
        this.financialYear = new FinancialYear();
        this.productType = new ProductType();
        this.labour = new Labour();
    }
}
