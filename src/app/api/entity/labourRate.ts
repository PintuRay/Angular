

export class LabourRateModel {
    fk_FinancialYearId: string = '';
    date: Date = new Date();
    fk_ProductTypeId: string = '';
    fk_ProductId: string = '';
    fk_BranchId?: string;
    rate: number = 0;
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  export class LabourRateUpdateModel extends LabourRateModel {
    labourRateId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class LabourRateDto extends LabourRateUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  