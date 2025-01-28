import { ProductionTransactionDto, ProductionTransactionModel, ProductionTransactionUpdateModel } from "./productionTransaction";

export class ProductionOrderModel {
  fk_FinishedGoodId: string = '';
  productionTransactions: ProductionTransactionModel[] = [];
  constructor() {
    // Optionally, set default values here if needed
  }
}

export class ProductionOrderUpdateModel extends ProductionOrderModel {
  productionOrderId: string = '';
  override  productionTransactions: ProductionTransactionUpdateModel[] = [];
  constructor() {
    super();
    // Optionally, set default values here if needed
  }
}
export class ProductionOrderDto extends ProductionOrderUpdateModel {
  override  productionTransactions: ProductionTransactionDto[] = [];
  constructor() {
    super();
    // Optionally, set default values here if needed
  }
}
