export class ProductGroupModel {
    productGroupName: string = '';
    fk_ProductTypeId: string = '';
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  export class ProductGroupUpdateModel extends ProductGroupModel {
    productGroupId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class ProductGroupDto extends ProductGroupUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  