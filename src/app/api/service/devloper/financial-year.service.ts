import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config.Service';
import { Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Base } from '../../base';
import { PaginationParams } from '../../model/paginationParams';
import { FinancialYearModel, FinancialYearUpdateModel } from '../../entity/financialYear';

@Injectable()
export class FinancialYearService {

  //#region Constructor
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) { }
  //#endregion

  //#region Api
  getAllFinancialYears(): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'getAllFinancialYears')
      .pipe(
        switchMap((endpoint) =>
          this.http.get<Base>(endpoint)
        )
      );
  }
  getFinancialYears(data: PaginationParams): Observable<Base> {
    let params = new HttpParams()
      .set('pageNumber', data.pageNumber.toString())
      .set('pageSize', data.pageSize.toString())

    if (data.searchTerm !== null) {
      params = params.set('searchTerm', data.searchTerm);
    }

    return this.configService
      .getEndpoint('devloper', 'getFinancialYears')
      .pipe(
        switchMap((endpoint) =>
          this.http.get<Base>(endpoint, { params })
        )
      );
  }
  createFinancialYear(data: FinancialYearModel): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'createFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.post<Base>(endpoint, data))
      );
  }
  bulkCreateFinancialYear(data: FinancialYearModel[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkCreateFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.post<Base>(endpoint, data))
      );
  }
  updateFinancialYear(data: FinancialYearUpdateModel): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'updateFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.patch<Base>(endpoint, data))
      );
  }
  bulkUpdateFinancialYear(data: FinancialYearUpdateModel[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkUpdateFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.patch<Base>(endpoint, data))
      );
  }
  removeFinancialYear(id: string): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'removeFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(`${endpoint}/${id}`, {}))
      );
  }
  bulkRemoveFinancialYear(Ids: string[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkRemoveFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(endpoint, Ids))
      );
  }
  getRemovedFinancialYears(data: PaginationParams): Observable<Base> {
    let params = new HttpParams()
      .set('pageNumber', data.pageNumber.toString())
      .set('pageSize', data.pageSize.toString())
    if (data.searchTerm !== null) {
      params = params.set('searchTerm', data.searchTerm);
    }

    return this.configService
      .getEndpoint('devloper', 'getRemovedFinancialYears')
      .pipe(
        switchMap((endpoint) =>
          this.http.get<Base>(endpoint, { params })
        )
      );
  }
  recoverFinancialYear(id: string): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'recoverFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(`${endpoint}/${id}`, {}))
      );
  }
  bulkRecoverFinancialYear(Ids: string[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkRecoverFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(endpoint, Ids))
      );
  }
  deleteFinancialYear(Id: string): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'deleteFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.delete<Base>(`${endpoint}/${Id}`))
      );
  }
  bulkDeleteFinancialYear(ids: string[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkDeleteFinancialYear')
      .pipe(
        switchMap((endpoint) =>
          this.http.delete<Base>(endpoint, {
            body: ids
          })
        )
      );
  }
  //#endregion
}
