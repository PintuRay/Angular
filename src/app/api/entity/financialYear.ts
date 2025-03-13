/*------------------------- Api Model----------------*/
export class FinancialYearModel {
    fk_BranchId:string;
    financial_Year: string;
    startDate: Date;
    endDate: Date;
    constructor() {
        this.fk_BranchId = '';
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
    branchName: string;
    constructor() {
        super();
        this.branchName = '';
    }
}
/*===========================================Auto Mapping======================================================*/
   export class FinancialYearMapper {
    static dtoToUpdateModel(dto: FinancialYearDto): FinancialYearUpdateModel {
      const updateModel = new FinancialYearUpdateModel();
      Object.assign(updateModel, {
        financialYearId: dto.financialYearId,
        fk_BranchId: dto.fk_BranchId,
        financial_Year: dto.financial_Year,
        startDate: dto.startDate,
        endDate : dto.endDate,
      });
      return updateModel;
    }
  }
/*-------------------------opertion Model----------------*/
export interface FinancialYearOperation {
    financialYear: FinancialYearDto | null;
    isSuccess: boolean;
    message?: string;
}

export interface BulkFinancialYearOperation {
    financialYears: FinancialYearDto[] | null;
    isSuccess?: boolean;
    message?: string;
}