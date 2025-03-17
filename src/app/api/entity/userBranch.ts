export class UserBranchModel {
  fk_UserId: string = '';
  fk_BranchId: string = '';

  constructor() {

  }
}

export class UserBranchUpdateModel extends UserBranchModel {
  id: string = '';
  constructor() {
    super();

  }
}
export class UserBranchDto extends UserBranchUpdateModel {
  userName: string = '';
  branchName: string = '';
  constructor() {
    super();
  }
}
/*===========================================Auto Mapping======================================================*/
   export class UserBranchMapper {
    static dtoToUpdateModel(dto: UserBranchDto): UserBranchUpdateModel {
      const updateModel = new UserBranchUpdateModel();
      Object.assign(updateModel, {
        id: dto.id,
        fk_UserId: dto.fk_UserId,
        fk_BranchId: dto.fk_BranchId,
      });
      return updateModel;
    }
  }
/*===========================================opertion Model======================================================*/
export interface UserBranchOperation {
    userBranch: UserBranchDto | null;
    isSuccess: boolean;
    message?: string;
}
