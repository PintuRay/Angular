import { AlternateUnit } from "./alternateUnit";
import { DamageTransaction } from "./damageTransaction";
import { InwardSupplyTransaction } from "./inwardSupplyTransaction";
import { LabourOrder } from "./labourOrder";
import { LabourRate } from "./labourRate";
import { LabourTransaction } from "./labourTransaction";
import { OutwardSupplyTransaction } from "./outwardSupplyTransaction";
import { ProductGroup } from "./productGroup";
import { ProductSubGroup } from "./productSubGroup";
import { ProductType } from "./productType";
import { PurchaseReturnTransaction } from "./purchaseReturnTransaction";
import { PurchaseTransaction } from "./purchaseTransaction";
import { SalesReturnTransaction } from "./salesReturnTransaction";
import { SalesTransaction } from "./salesTransaction";
import { Stock } from "./stock";
import { Unit } from "./unit";

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
  
  export class Product extends ProductModel {
    productId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    productType: ProductType = new ProductType();
    productGroup: ProductGroup = new ProductGroup();
    productSubGroup: ProductSubGroup = new ProductSubGroup();
    unit: Unit = new Unit();
    alternateUnits: AlternateUnit[] = [];
    labourRates: LabourRate[] = [];
    stocks: Stock[] = [];
    labourOrders: LabourOrder[] = [];
    labourTransactions: LabourTransaction[] = [];
    purchaseTransactions: PurchaseTransaction[] = [];
    purchaseReturnTransactions: PurchaseReturnTransaction[] = [];
    salesTransactions: SalesTransaction[] = [];
    salesReturnTransactions: SalesReturnTransaction[] = [];
    inwardSupplyTransactions: InwardSupplyTransaction[] = [];
    outwardSupplyTransactions: OutwardSupplyTransaction[] = [];
    damageTransactions: DamageTransaction[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  