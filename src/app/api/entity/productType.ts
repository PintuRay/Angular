export class ProductTypeModel {
    productType: string = '';
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class ProductTypeUpdateModel extends ProductTypeModel {
    productTypeId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class ProductTypeDto extends ProductTypeUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  