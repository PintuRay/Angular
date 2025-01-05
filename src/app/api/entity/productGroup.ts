import { Product } from "./product";
import { ProductSubGroup } from "./productSubGroup";
import { ProductType } from "./productType";

export class ProductGroupModel {
    productGroupName: string = '';
    fk_ProductTypeId: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class ProductGroup extends ProductGroupModel {
    productGroupId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    productType: ProductType = new ProductType();
    productSubGroups: ProductSubGroup[] = [];
    products: Product[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  