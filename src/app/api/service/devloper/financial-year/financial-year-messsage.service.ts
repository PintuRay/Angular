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

    }
    protected override handleNotFound(response: ApiResponse) {

    }
}