export class ProductSubGroupModel {
    fk_ProductGroupId: string = '';
    productSubGroupName: string = '';
      constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class ProductSubGroupUpdateModel extends ProductSubGroupModel {
    productSubGroupId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }

  export class ProductSubGroupDto extends ProductSubGroupUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  