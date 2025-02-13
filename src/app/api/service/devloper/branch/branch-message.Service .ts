import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiResponse } from '../../ApiResponse';
import { GenericMessageService } from '../../generic-message.Service';

@Injectable()
export class BranchMessageService extends GenericMessageService {
  constructor(messageService: MessageService) {
    super(messageService);
  }
  // Override the generic handlers with branch-specific ones
  protected override handleFound(response: ApiResponse) {
    if (Array.isArray(response.data)) {
      const branchNames = response.data
        .map((branch: any) => branch.branchName)
        .join(', ');
      this.messageService.add({ severity: 'warn', summary: 'Duplicate Entry',detail: `Branch(es) already exist: ${branchNames}` });
    } else {
      super.handleFound(response);
    }
  }
  protected override handleNotFound(response: ApiResponse) {
    if (Array.isArray(response.data)) {
      const branchNames = response.data
        .map((branch: any) => branch.branchName)
        .join(', ');
      this.messageService.add({
        severity: 'warn',
        summary: 'Not Found',
        detail: `Branch(es) not found: ${branchNames}`
      });
    } else {
      super.handleNotFound(response);
    }
  }
}