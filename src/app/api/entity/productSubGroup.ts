import { Product } from "./product";
import { ProductGroup } from "./productGroup";

export class ProductSubGroupModel {
    fk_ProductGroupId: string = '';
    productSubGroupName: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class ProductSubGroup extends ProductSubGroupModel {
    productSubGroupId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    productGroup: ProductGroup = new ProductGroup();
    products: Product[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  