import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserBranchService } from 'src/app/api/service/admin/user-branch/user-branch.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { CommonService } from 'src/app/api/service/common/common.service';
import { UserBranchMessageService } from 'src/app/api/service/admin/user-branch/user-branch-message.service';
import { catchError, distinctUntilChanged, filter, finalize, forkJoin, map, Observable, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { UserBranchDto, UserBranchMapper, UserBranchModel, UserBranchUpdateModel } from 'src/app/api/entity/userBranch';
import { BranchDto } from 'src/app/api/entity/branch';
import { UserDto } from 'src/app/api/entity/user-model';

@Component({
  selector: 'app-add-update-user-branch',
  templateUrl: './add-update-user-branch.component.html',
})
export class AddUpdateUserBranchComponent {

  //#region Property Declaration
  public UserBranchForm: FormGroup;
  private readonly destroy$ = new Subject<void>();
  private branches: BranchDto[] = [];
  public filteredBranches: BranchDto[] = [];
  private users: UserDto[] = [];
  public filteredUsers: UserDto[] = [];
  public visible: boolean = false;
  public operationType = '';
  private addUserBranch: UserBranchModel = new UserBranchModel();
  private updateUserBranch: UserBranchUpdateModel = new UserBranchUpdateModel();
  public isLoading = false;
  //#endregion

  //#region constructor
  constructor(private fb: FormBuilder,
    private userBranchSvcs: UserBranchService,
    public layoutSvcs: LayoutService,
    private commonSvcs: CommonService,
    private messageService: UserBranchMessageService) {
    this.UserBranchForm = this.initializeForm();
  }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit() {
    this.loadInitialData();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

  //#region Form Initialization
  private initializeForm(ub?: UserBranchUpdateModel): FormGroup {
    return this.fb.group({
      user: [ub?.fk_UserId && this.users?.length ? this.users.find(c => c.id === ub.fk_UserId) : null, Validators.required],
      branch: [ub?.fk_BranchId && this.branches?.length ? this.branches.find(c => c.branchId === ub.fk_BranchId) : null, Validators.required],
    })
  }
  private loadInitialData() {
    // forkJoin should be used to combine these parallel requests
    forkJoin({
      branches: this.getAllBranch(),
      users: this.getAllUser()
    }).pipe(
      // Set initial data from parallel requests
      tap(({ branches, users }) => {
        this.branches = branches;
        this.filteredBranches = branches;
        this.users = users;
        this.filteredUsers = users;
      }),
      // Then monitor dialog visibility
      switchMap(() => this.userBranchSvcs.changeAddUpdateDialogVisibility$.pipe(
        takeUntil(this.destroy$),
        filter(isVisible => isVisible === true),
        tap(isVisible => {
          this.visible = isVisible;
        }),
        // Get operation type when dialog becomes visible
        switchMap(() => this.userBranchSvcs.getOperationType().pipe(take(1))),
        tap(operationType => {
          this.operationType = operationType;
        }),
        // Get user branch data
        switchMap(() => this.userBranchSvcs.getUserBranch().pipe(
          take(1),
          catchError(() => of({ userBranch: null }))
        ))
      )),
      // Handle edit mode if userBranch exists
      switchMap(operation => {
        if (operation?.userBranch) {
          return this.handleEditMode(operation.userBranch);
        }
        return of(null);
      }),
      tap(() => {
        this.setupFormValueChanges();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private handleEditMode(ub: UserBranchDto): Observable<void> {
    this.updateUserBranch = UserBranchMapper.dtoToUpdateModel(ub);
    this.UserBranchForm = this.initializeForm(this.updateUserBranch);
    return of(undefined);
  }
  private setupFormValueChanges() {
    this.destroy$.next();
    this.UserBranchForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe(values => {
      if (this.operationType === 'edit') {
        this.updateUserBranch = {
          ...this.updateUserBranch,
          fk_BranchId: values.branch?.branchId,
          fk_UserId: values.user?.id,
        };
      } else {
        if (this.operationType === 'add') {
          this.addUserBranch = {
            fk_BranchId: values.branch?.branchId,
            fk_UserId: values.user?.id,
          };
        }
      }
    });
  }
  //#endregion

  //#region Client Side Vaildation
  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      branch: 'Branch',
      user: 'User'
    };
    return labels[controlName] || controlName;
  }
  private getFormControl(controlName: string) {
    return this.UserBranchForm.get(controlName);
  }
  public isFieldInvalid(controlName: string): boolean {
    const control = this.getFormControl(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
  public getErrorMessage(controlName: string): string {
    const control = this.getFormControl(controlName);
    if (!control) return '';
    if (control.hasError('required')) {
      return `${this.getFieldLabel(controlName)} is required.`;
    }
    return '';
  }
  //#endregion

  //#region Client Side Operations
  filterBranches(event: any) {
    const query = event.query.toLowerCase();
    this.filteredBranches = this.branches.filter(branch =>
      branch.branchName.toLowerCase().includes(query)
    );
  }
  filterUsers(event: any) {
    const query = event.query.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(query)
    );
  }
  private resetComponent() {
    this.UserBranchForm.reset();
    this.addUserBranch = new UserBranchModel();
    this.updateUserBranch = new UserBranchUpdateModel();
    this.visible = false;
  }
  public hideDialog() {
    this.userBranchSvcs.hideAddUpdateDialog();
    this.resetComponent();
  }
  //#endregion

  //#region Server Side Operation
  private getAllBranch(): Observable<BranchDto[]> {
    return this.commonSvcs.getBranches().pipe(
      takeUntil(this.destroy$),
      map(response => response.data as BranchDto[]),
      catchError(err => {
        this.branches = [];
        return of(this.branches);
      })
    );
  }
  private getAllUser(): Observable<UserDto[]> {
    return this.commonSvcs.getBranches().pipe(
      takeUntil(this.destroy$),
      map(response => response.data as UserDto[]),
      catchError(err => {
        this.users = [];
        return of(this.users);
      })
    );
  }
    public submit(): void {
      if (this.UserBranchForm.invalid) {
        this.UserBranchForm.markAllAsTouched();
        return;
      }
      else {
        if (this.UserBranchForm.dirty && this.UserBranchForm.touched) {
          this.isLoading = true;
          const operation$ = this.operationType === 'edit' ? this.userBranchSvcs.update(this.updateUserBranch) : this.userBranchSvcs.create(this.addUserBranch);
          operation$.pipe(
            finalize(() => this.isLoading = false)
          ).subscribe({
            next: (response) => {
              if (response.responseCode === 200 || response.responseCode === 201) {
                this.userBranchSvcs.setUserBranch({ userBranch: response.data, isSuccess: true, message: response.message });
                this.hideDialog();
              }
            },
            error: (error) => {
              this.messageService.error('Operation failed');
            }
          });
        }
        else {
          this.messageService.info('No Change Detected');
        }
      }
    }
  //#endregion

  //#region Test form
  get formJson(): string {
    return JSON.stringify(this.UserBranchForm.value, null, 2);
  }
  get financialYearModelJson(): string {
    return JSON.stringify(this.addUserBranch, null, 2);
  }
  get financialYearUpdateModelJson(): string {
    return JSON.stringify(this.updateUserBranch, null, 2);
  }
  get formErrors(): string {
    return JSON.stringify(this.UserBranchForm.errors, null, 2);
  }
  //#endregion
}
