import { Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { UserBranchDto, UserBranchOperation } from 'src/app/api/entity/userBranch';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { UserBranchMessageService } from 'src/app/api/service/admin/user-branch/user-branch-message.service';
import { UserBranchService } from 'src/app/api/service/admin/user-branch/user-branch.service';
import { AddUpdateUserBranchComponent } from '../add-update-user-branch/add-update-user-branch.component';
import { ListRecoverUserBranchComponent } from '../list-recover-user-branch/list-recover-user-branch.component';

@Component({
  selector: 'app-list-user-branch',
  templateUrl: './list-user-branch.component.html',

})
export class ListUserBranchComponent {

  //#region Property Declaration
  public canDelete: boolean = false;
  public canCreate: boolean = false;
  public canUpdate: boolean = false;
  public isAdmin: boolean = false;
  public pagination: PaginationParams = new PaginationParams();
  private readonly destroy$ = new Subject<void>();
  private componentRef: ComponentRef<any> | null = null;
  public userBranches: UserBranchDto[] = [];
  public totalRecords: number = 0;
  public loading: boolean = false;
  //#endregion 

  //#region constructor
  constructor(
    private userBranchSvcs: UserBranchService,
    private authSvcs: AuthenticationService,
    private confirmationService: ConfirmationService,
    private messageService: UserBranchMessageService,
    private viewContainerRef: ViewContainerRef,
  ) { }
  //#endregion 

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.canDelete = this.authSvcs.getUserDetails().permissions.delete;
    this.canCreate = this.authSvcs.getUserDetails().permissions.create;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.isAdmin = this.authSvcs.getUserDetails().role.toLowerCase() === "admin";
    this.getUserBranches(this.pagination);
    this.setupSubscriptions();
  }
  ngOnDestroy(): void {
    // This will automatically unsubscribe from all subscriptions using takeUntil
    this.destroy$.next();
    this.destroy$.complete();
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
  //#endregion

  //#region Subscription
  private setupSubscriptions(): void {
    this.userBranchSvcs.getUserBranch()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        operation => this.handleAddUpdateOperation(operation)
      );
    this.userBranchSvcs.getRecoverUserBranch()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        operation => this.handleRecoverOperation(operation)
      );
  }
  private handleAddUpdateOperation(operation: UserBranchOperation | null): void {
    if (operation?.isSuccess) {
      if (operation.userBranch) {
        const index = this.userBranches.findIndex(item => item.id === operation.userBranch?.id);
        if (index !== -1) {
          this.userBranches[index] = operation.userBranch;
        } else {
          this.userBranches = [...this.userBranches, operation.userBranch];
          this.totalRecords += 1;
        }
      }
      this.messageService.success(operation.message);
    }
  }
  private handleRecoverOperation(operation: UserBranchOperation | null): void {
    if (operation?.isSuccess) {
      if (operation.userBranch) {
        this.userBranches = [...this.userBranches, operation.userBranch];
        this.totalRecords += 1;
      }
      this.messageService.success(operation.message);
    }
  }
  //#endregion

  //#region Pagination , Searching , Shorting
  onGlobalFilter(searchText: HTMLInputElement) {
    this.pagination.searchTerm = searchText.value;
    this.pagination.pageNumber = 0;
    this.getUserBranches(this.pagination);
  }
  onPageChange(event: any) {
    this.pagination.pageNumber = event.first / event.rows;
    this.pagination.pageSize = event.rows;
    this.getUserBranches(this.pagination);
  }
  clearSearch() {
    this.pagination.searchTerm = '';
    this.getUserBranches(this.pagination);
  }
  //#endregion

  //#region Client Side Operations
  public addUserBranch() {
    this.userBranchSvcs.setOperationType("add");
    this.userBranchSvcs.showAddUpdatedDialog();
    this.userBranchSvcs.setUserBranch(null);
    this.loadComponent(AddUpdateUserBranchComponent);
  }
  public editUserBranch(userBranch: UserBranchDto) {
    this.userBranchSvcs.setOperationType("edit");
    this.userBranchSvcs.setUserBranch({ userBranch: userBranch, isSuccess: false });
    this.userBranchSvcs.showAddUpdatedDialog();
    this.loadComponent(AddUpdateUserBranchComponent);
  }
  public recoverUserBranch() {
    this.userBranchSvcs.showRecoverDialog();
    this.loadComponent(ListRecoverUserBranchComponent);
  }
  private loadComponent(component: any) {
    this.viewContainerRef.clear();
    this.componentRef = this.viewContainerRef.createComponent(component);
  }
  //#endregion

  //#region Server Side Operation
  private getUserBranches(pagination: PaginationParams): void {
    this.loading = true;
    this.userBranchSvcs.get(pagination).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.responseCode === 200) {
          this.userBranches = response.data as UserBranchDto[];
          this.totalRecords = response.count;
        }
      },
      error: (err) => {
        this.loading = false;
      }
    })
  }
  public removeFinancialYear(id: string, event: Event) {
    this.confirmationService.confirm({
      key: 'remove',
      target: event.target || new EventTarget,
      message: 'Are you sure that you want to Delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userBranchSvcs.remove(id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.responseCode === 200) {
              this.userBranches = this.userBranches.filter(s => s.id !== id);
              this.totalRecords -= 1;
              if (this.userBranches.length === 0) {
                this.pagination = new PaginationParams();
                this.getUserBranches(this.pagination);
              }
            }
          },
          error: (err) => { }
        })
      },
      reject: () => {
        this.messageService.error('You have rejected');
      }
    });
  }
  //#endregion

  //#region Test form
  get UserBranchDtoJson(): string {
    return JSON.stringify(this.userBranches, null, 2);
  }
  //#endregion
}


