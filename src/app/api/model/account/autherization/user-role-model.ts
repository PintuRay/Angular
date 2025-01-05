export class UserRoleModel {
    roleId: string;
    roleName: string;
    isRoleSelected: boolean;
    constructor() {
      this.roleId = '';
      this.roleName = '';
      this.isRoleSelected = false;
    }
  }