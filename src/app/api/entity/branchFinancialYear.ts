import { BranchDto } from "./branch";
import { FinancialYearDto } from "./financialYear";

export class BranchFinancialYearModel {
    fk_FinancialYearId: string;
    fk_BranchId: string;
    constructor() {
        this.fk_FinancialYearId = '';
        this.fk_BranchId = '';
    }
}
export class BranchFinancialYearUpdateModel extends BranchFinancialYearModel {
    branchFinancialYearId: string;
    constructor() {
        super();
        this.branchFinancialYearId = '';
    }
}
export class BranchFinancialYearDto extends BranchFinancialYearUpdateModel {
    branch?: BranchDto | null;
    financialYear?: FinancialYearDto| null;
    constructor() {
        super();
        this.branch = null;
        this.financialYear = null;
    }
}
/*-------------------------opertion Model----------------*/
export interface BranchFinancialYearOperation {
    branchFinancialYear: BranchFinancialYearDto | null;
    isSuccess: boolean;
    message?: string;
}
export interface BulkBranchFinancialYearOperation {
    branchFinancialYears: BranchFinancialYearDto[] | null;
    isSuccess: boolean;
    message?: string;
}
