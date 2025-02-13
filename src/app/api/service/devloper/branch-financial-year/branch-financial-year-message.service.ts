import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiResponse } from '../../../model/ApiResponse';
import { GenericMessageService } from '../../generic-message.Service';

@Injectable()
export class BranchFinancialYearMessageService extends GenericMessageService {
    constructor(messageService: MessageService) {
        super(messageService);
    }
    // Override the generic handlers with branch-specific ones
    protected override handleFound(response: ApiResponse) {

    }
    protected override handleNotFound(response: ApiResponse) {

    }
}