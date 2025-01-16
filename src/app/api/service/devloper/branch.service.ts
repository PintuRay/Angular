import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config.Service';
import { Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Base } from '../../base';
import { PaginationParams } from '../../model/paginationParams';
import { BranchModel, BranchUpdateModel } from '../../entity/branch';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  //#region Property Declaration
  //#endregion
 
  //#region Constructor
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private router: Router
  ) { }
  //#endregion
  
  //#region Api
  getAllBranch(data: PaginationParams): Observable<Base> {
    const params = new HttpParams()
      .set('pageNumber', data.pageNumber.toString())
      .set('pageSize', data.pageSize.toString())
      .set('searchTerm', data.searchTerm);
    return this.configService
      .getEndpoint('devloper', 'getAllBranch')
      .pipe(
        switchMap((endpoint) =>
          this.http.get<Base>(endpoint, { params })
        )
      );
  }
  createBranch(data: BranchModel): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'createBranch')
      .pipe(
        switchMap((endpoint) => this.http.post<Base>(endpoint, data))
      );
  }
  bulkCreateBranch(data: BranchModel[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkCreateBranch')
      .pipe(
        switchMap((endpoint) => this.http.post<Base>(endpoint, data))
      );
  }
  updateBranch(data: BranchUpdateModel): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'updateBranch')
      .pipe(
        switchMap((endpoint) => this.http.patch<Base>(endpoint, data))
      );
  }
  bulkUpdateBranch(data: BranchUpdateModel[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkUpdateBranch')
      .pipe(
        switchMap((endpoint) => this.http.patch<Base>(endpoint, data))
      );
  }
  removeBranch(id: string): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'removeBranch')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(`${endpoint}/${id}`, {}))
      );
  }
  bulkRemoveBranch(Ids: string[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkRemoveBranch')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(endpoint, Ids))
      );
  }
  getRemovedBranches(data: PaginationParams): Observable<Base> {
    const params = new HttpParams()
      .set('pageNumber', data.pageNumber.toString())
      .set('pageSize', data.pageSize.toString())
      .set('searchTerm', data.searchTerm);
    return this.configService
      .getEndpoint('devloper', 'getRemovedBranches')
      .pipe(
        switchMap((endpoint) =>
          this.http.get<Base>(endpoint, { params })
        )
      );
  }
  recoverBranch(id: string): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'recoverBranch')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(`${endpoint}/${id}`, {}))
      );
  }
  bulkRecoverBranch(Ids: string[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkRecoverBranch')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(endpoint, Ids))
      );
  }
  deleteBranch(Id: string): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'deleteBranch')
      .pipe(
        switchMap((endpoint) => this.http.delete<Base>(`${endpoint}/${Id}`))
      );
  }
  bulkDeleteBranch(ids: string[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkDeleteBranch')
      .pipe(
        switchMap((endpoint) =>
          this.http.delete<Base>(endpoint, {
            body: ids
          })
        )
      );
  }

  //#endregion

  //#region component service

 //#endregion
}
