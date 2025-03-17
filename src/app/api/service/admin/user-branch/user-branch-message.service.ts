import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiResponse } from '../../../model/ApiResponse';
import { GenericMessageService } from '../../generic-message.Service';

@Injectable()
export class UserBranchMessageService extends GenericMessageService {
    constructor(messageService: MessageService) {
        super(messageService);
    }
    protected override handleFound(response: ApiResponse) {
        if (Array.isArray(response.data)) {
            const userBranches = response.data
              .map((data: any) => data.id)
              .join(', ');
            this.messageService.add({ severity: 'warn', summary: 'Duplicate Entry',detail: `UserBrnch(es) already exist: ${userBranches}` });
          } else {
            super.handleFound(response);
          }
    }
    protected override handleNotFound(response: ApiResponse) {
        if (Array.isArray(response.data)) {
            const userBranches = response.data
              .map((data: any) => data.id)
              .join(', ');
            this.messageService.add({
              severity: 'warn',
              summary: 'Not Found',
              detail: `UserBrnch(es) not found: ${userBranches}`
            });
          } else {
            super.handleNotFound(response);
          }
    }
}