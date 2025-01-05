import { Branch } from "./branch";
import { FinancialYear } from "./financialYear";

export class BranchFinancialYearModel
{
    fk_FinancialYearId: string;
    fk_BranchId: string;

    constructor() {
        this.fk_FinancialYearId = '';
        this.fk_BranchId = '';
    }
}
export class  BranchFinancialYear extends BranchFinancialYearModel{
    branchFinancialYearId: string; 
    isActive?: boolean; 
    createdDate?: Date;
    modifyDate?: Date; 
    createdBy?: string; 
    modifyBy?: string; 
    branch?: Branch; 
    financialYear?: FinancialYear;

    constructor() {
        super();
        this.branchFinancialYearId = '';
        this.isActive = true; 
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = '';
        this.modifyBy = '';
        this.branch = new Branch();
        this.financialYear = new FinancialYear();
    }
}