export class BranchFinancialYearModel
{
    fk_FinancialYearId: string;
    fk_BranchId: string;
    constructor() {
        this.fk_FinancialYearId = '';
        this.fk_BranchId = '';
    }
}
export class  BranchFinancialYearUpdateModel extends BranchFinancialYearModel{
    branchFinancialYearId: string; 
    constructor() {
        super();
        this.branchFinancialYearId = '';
    }
}
export class BranchFinancialYearDto  extends BranchFinancialYearUpdateModel{

    constructor() {
        super();
    }
}