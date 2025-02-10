import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config.Service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Base } from '../../base';
import { PaginationParams } from '../../model/paginationParams';
import { BranchDto, BranchModel, BranchOperation, BranchUpdateModel, BulkBranchOperation } from '../../entity/branch';

@Injectable()
export class BranchService {

  //#region Property Declaration
  private addUpdateBranchVisibilitySubject = new BehaviorSubject<boolean>(false);
  changeAddUpdateBranchDialogVisibility$ = this.addUpdateBranchVisibilitySubject.asObservable();
  private branchSubject = new BehaviorSubject<BranchOperation | null>(null);
  private bulkBranchSubject = new BehaviorSubject<BulkBranchOperation | null>(null);
  private operationTypeSubject = new BehaviorSubject<string>('');
  private bulkOperationTypeSubject = new BehaviorSubject<string>('');
  //#endregion

  //#region Constructor
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) { }
  //#endregion

  //#region Api
  getAll(): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'getAllBranches')
      .pipe(
        switchMap((endpoint) =>
          this.http.get<Base>(endpoint)
        )
      );
  }
  get(data: PaginationParams): Observable<Base> {
    let params = new HttpParams()
      .set('pageNumber', data.pageNumber.toString())
      .set('pageSize', data.pageSize.toString())

    if (data.searchTerm !== null) {
      params = params.set('searchTerm', data.searchTerm);
    }

    return this.configService
      .getEndpoint('devloper', 'getBranches')
      .pipe(
        switchMap((endpoint) =>
          this.http.get<Base>(endpoint, { params })
        )
      );
  }
  create(data: BranchModel): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'createBranch')
      .pipe(
        switchMap((endpoint) => this.http.post<Base>(endpoint, data))
      );
  }
  bulkCreate(data: BranchModel[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkCreateBranch')
      .pipe(
        switchMap((endpoint) => this.http.post<Base>(endpoint, data))
      );
  }
  update(data: BranchUpdateModel): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'updateBranch')
      .pipe(
        switchMap((endpoint) => this.http.patch<Base>(endpoint, data))
      );
  }
  bulkUpdate(data: BranchUpdateModel[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkUpdateBranch')
      .pipe(
        switchMap((endpoint) => this.http.patch<Base>(endpoint, data))
      );
  }
  remove(id: string): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'removeBranch')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(`${endpoint}/${id}`, {}))
      );
  }
  bulkRemove(data: BranchUpdateModel[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkRemoveBranch')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(endpoint, data))
      );
  }
  getRemoved(data: PaginationParams): Observable<Base> {
    let params = new HttpParams()
      .set('pageNumber', data.pageNumber.toString())
      .set('pageSize', data.pageSize.toString())
    if (data.searchTerm !== null) {
      params = params.set('searchTerm', data.searchTerm);
    }

    return this.configService
      .getEndpoint('devloper', 'getRemovedBranches')
      .pipe(
        switchMap((endpoint) =>
          this.http.get<Base>(endpoint, { params })
        )
      );
  }
  recover(id: string): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'recoverBranch')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(`${endpoint}/${id}`, {}))
      );
  }
  bulkRecover(data: BranchUpdateModel[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkRecoverBranch')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(endpoint, data))
      );
  }
  delete(Id: string): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'deleteBranch')
      .pipe(
        switchMap((endpoint) => this.http.delete<Base>(`${endpoint}/${Id}`))
      );
  }
  bulkDelete(ids: string[]): Observable<Base> {
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

  //#region component modal service
  showAddUpdatedDialog() {
    this.addUpdateBranchVisibilitySubject.next(true);
  }
  hideAddUpdateDialog() {
    this.addUpdateBranchVisibilitySubject.next(false);
  }
  //#endregion

  //#region component  service
  //single
  setOperationType(operationType: string) {
    this.operationTypeSubject.next(operationType);
  }
  getOperationType(): Observable<string> {
    return this.operationTypeSubject.asObservable();
  }
  setBranch(branchOperation: BranchOperation): void {
    this.branchSubject.next(branchOperation);
  }
  getBranch(): Observable<BranchOperation | null> {
    return this.branchSubject.asObservable();
  }
  //bulk
  setBulkOperationType(operationType: string) {
    this.bulkOperationTypeSubject.next(operationType);
  }
  getBulkOperationType(): Observable<string> {
    return this.bulkOperationTypeSubject.asObservable();
  }
  setBulkBranch(bulkBranchOperation: BulkBranchOperation): void {
    this.bulkBranchSubject.next(bulkBranchOperation);
  }
  getBulkBranch(): Observable<BulkBranchOperation | null> {
    return this.bulkBranchSubject.asObservable();
  }
  //#endregion
}
