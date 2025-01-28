export class LedgerGroupModel {
    groupName: string = '';
    groupAlias: string = '';
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  export class LedgerGroupUpdateModel extends LedgerGroupModel {
    ledgerGroupId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class LedgerGroupDto extends LedgerGroupUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  