/*------------------------- Api Model----------------*/
export class FinancialYearModel {
    financial_Year: string;
    startDate: Date;
    endDate: Date;
    constructor() {
        this.financial_Year = '';
        this.startDate = new Date();
        this.endDate = new Date();
    }
}
export class FinancialYearUpdateModel extends FinancialYearModel {
    financialYearId: string;
    constructor() {
        super();
        this.financialYearId = '';
    }
}
export class FinancialYearDto extends FinancialYearUpdateModel {
    constructor() {
        super();
    }
}
/*-------------------------opertion Model----------------*/
export interface FinancialYearOperation {
    financialYear: FinancialYearDto | null;
    isSuccess: boolean;

}
export interface RecoverFinancialYearOperation extends FinancialYearOperation {
    message: string;
}