import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { UserBranchDto } from 'src/app/api/entity/userBranch';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { UserBranchMessageService } from 'src/app/api/service/admin/user-branch/user-branch-message.service';
import { UserBranchService } from 'src/app/api/service/admin/user-branch/user-branch.service';

@Component({
  selector: 'app-list-recover-user-branch',
  templateUrl: './list-recover-user-branch.component.html',

})
export class ListRecoverUserBranchComponent {
  //#region Property Declaration
  public canDelete: boolean = false;
  public canCreate: boolean = false;
  public canUpdate: boolean = false;
  public isAdmin: boolean = false;
  private dialogSub!: Subscription;
  public visible: boolean = false;
  public pagination: PaginationParams = new PaginationParams();
  public userBranches: UserBranchDto[] = [];
  public loading: boolean = false;
  private readonly destroy$ = new Subject<void>();
  public totalRecords: number = 0;
  //#endregion 

  //#region constructor
  constructor(
    private userBranchSvcs: UserBranchService,
    private authSvcs: AuthenticationService,
    private confirmationService: ConfirmationService,
    private messageService: UserBranchMessageService,
  ) { }
  //#endregion   

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.canDelete = this.authSvcs.getUserDetails().permissions.delete;
    this.canCreate = this.authSvcs.getUserDetails().permissions.create;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.isAdmin = this.authSvcs.getUserDetails().role.toLowerCase() === "admin";
    this.dialogSub = this.userBranchSvcs.changeRecoverDialogVisibility$.subscribe(
      isVisible => {
        this.visible = isVisible;
        if (isVisible) {
          this.getRemovedUserBranches(this.pagination);
        }
      }
    );
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.dialogSub?.unsubscribe();
  }
  //#endregion 

  //#region Pagination , Searching , Shorting
  onGlobalFilter(searchText: HTMLInputElement) {
    this.pagination.searchTerm = searchText.value;
    this.pagination.pageNumber = 0;
    this.getRemovedUserBranches(this.pagination);
  }
  onPageChange(event: any) {
    this.pagination.pageNumber = event.first / event.rows;
    this.pagination.pageSize = event.rows;
    this.getRemovedUserBranches(this.pagination);
  }
  clearSearch() {
    this.pagination.searchTerm = '';
    this.getRemovedUserBranches(this.pagination);
  }
  //#endregion

  //#region Client Side Operations
  public hideDialog() {
    this.userBranchSvcs.hideRecoverDialog();
    this.userBranches = [];
  }
  //#endregion 

  //#region Server Side Operation
  private getRemovedUserBranches(pagination: PaginationParams) {
    this.loading = true;
    this.userBranchSvcs.getRemoved(pagination).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.responseCode === 200) {
          this.userBranches = response.data as UserBranchDto[];
          this.totalRecords = response.count;
        }
      },
      error: (err) => {
        this.loading = false;
      },
    })
  }
  public recoverUserBranch(data: UserBranchDto) {
    this.userBranchSvcs.recover(data.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response.responseCode === 200) {
          const recoveredUserBranch = response.data as UserBranchDto;
          this.userBranchSvcs.setRecoverUserBranch({ userBranch: recoveredUserBranch, isSuccess: true, message: response.message });
          this.hideDialog();
        }
      },
      error: (err) => { }
    })
  }
  public deleteUserBranch(id: string, event: Event) {
    this.confirmationService.confirm({
      key: 'delete',
      target: event.target || new EventTarget,
      message: 'Are you sure that you want to Delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userBranchSvcs.delete(id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.responseCode === 200) {
              this.messageService.success(response.message);
              this.hideDialog();
            }
          },
          error: (err) => { }
        })
      },
      reject: () => {
        this.messageService.error('You have rejected');
      }
    })
  }
  //#endregion 
}
