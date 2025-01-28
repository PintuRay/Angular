export class LedgerSubGroupModel {
    fk_LedgerGroupId: string = '';
    fk_BranchId: string = '';
    subGroupName: string = '';
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  export class LedgerSubGroupUpdateModel extends LedgerSubGroupModel {
    ledgerSubGroupId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class LedgerSubGroupDto extends LedgerSubGroupUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  