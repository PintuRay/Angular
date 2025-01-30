import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config.Service';
import { Router } from '@angular/router';

@Injectable()
export class FinancialYearService {

  //#region Constructor
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) { }
  //#endregion

  //#region Api

  //#endregion
}
