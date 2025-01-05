import { DamageOrder } from "./damageOrder";
import { InwardSupplyOrder } from "./inwardSupplyOrder";
import { LabourRate } from "./labourRate";
import { OutwardSupplyOrder } from "./outwardSupplyOrder";
import { Product } from "./product";
import { ProductGroup } from "./productGroup";
import { PurchaseOrder } from "./purchaseOrder";
import { PurchaseReturnOrder } from "./purchaseReturnOrder";

export class ProductTypeModel {
    productType: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class ProductType extends ProductTypeModel {
    productTypeId: string = '';
    productGroups: ProductGroup[] = [];
    products: Product[] = [];
    purchaseOrders: PurchaseOrder[] = [];
    purchaseReturnOrders: PurchaseReturnOrder[] = [];
    labourRates: LabourRate[] = [];
    inwardSupplyOrders: InwardSupplyOrder[] = [];
    outwardSupplyOrders: OutwardSupplyOrder[] = [];
    damageOrders: DamageOrder[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  