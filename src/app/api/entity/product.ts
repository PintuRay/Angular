export class ProductModel {
    productName: string = '';
    retailPrice: number = 0;
    wholeSalePrice: number = 0;
    gst: number = 0;
    fk_ProductTypeId: string = '';
    fk_UnitId: string = '';
    fk_ProductGroupId: string = '';
    fk_ProductSubGroupId?: string;
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class ProductUpdateModel extends ProductModel {
    productId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class ProductDto extends ProductUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  