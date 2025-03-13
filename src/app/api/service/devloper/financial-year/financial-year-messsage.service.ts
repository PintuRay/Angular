import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiResponse } from '../../../model/ApiResponse';
import { GenericMessageService } from '../../generic-message.Service';

@Injectable()
export class FinancialYearMessageService extends GenericMessageService {
    constructor(messageService: MessageService) {
        super(messageService);
    }
    protected override handleFound(response: ApiResponse) {
        if (Array.isArray(response.data)) {
            const financialYears = response.data
              .map((data: any) => data.financial_Year)
              .join(', ');
            this.messageService.add({ severity: 'warn', summary: 'Duplicate Entry',detail: `FinancialYear(s) already exist: ${financialYears}` });
          } else {
            super.handleFound(response);
          }
    }
    protected override handleNotFound(response: ApiResponse) {
        if (Array.isArray(response.data)) {
            const financialYears = response.data
              .map((data: any) => data.financial_Year)
              .join(', ');
            this.messageService.add({
              severity: 'warn',
              summary: 'Not Found',
              detail: `FinancialYear(s) not found: ${financialYears}`
            });
          } else {
            super.handleNotFound(response);
          }
    }
}