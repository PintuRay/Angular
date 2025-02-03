import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BranchDto, BranchModel } from 'src/app/api/entity/branch';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { BranchService } from 'src/app/api/service/devloper/branch.service';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileUpload } from 'primeng/fileupload';
@Component({
  selector: 'app-list-branch',
  templateUrl: './list-branch.component.html',
  styles: `
    :host ::ng-deep {
        .p-paginator {
            .p-dropdown {
                height: 2.5rem;
                .p-dropdown-label {
                    padding-right: 0.5rem;
                }
            } 
            .p-dropdown-items-wrapper {
                max-height: 200px;
            }
        } 
        .p-dropdown-panel {
            .p-dropdown-items {
                padding: 0.5rem 0;
                .p-dropdown-item {
                    padding: 0.5rem 1rem;
                    margin: 0;
                    &:hover {
                        background: var(--surface-200);
                    }
                }
            }
        }
    }
  `
})
export class ListBranchComponent {

  //#region Property Declaration
  public display: boolean = false;
  public loading: boolean = false;
  public canDelete: boolean = false;
  public canCreate: boolean = false;
  public canUpdate: boolean = false;
  public isDevloper: boolean = false;
  private branchsubscription!: Subscription;
  private bulkBranchsubscription!: Subscription
  private deleteSubscription!: Subscription;
  private bulkDeleteSubscription!: Subscription;
  public branches: BranchDto[];
  public selectedBranches: BranchDto[];
  public cols: any[];
  public pagination: PaginationParams;
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  public importOptionsVisible: boolean = false;
  public exportOptionsVisible: boolean = false;
  public totalRecords: number = 0;
  //#endregion 

  //#region constructor
  constructor(
    private branchSvcs: BranchService,
    private authSvcs: AuthenticationService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.branches = [];
    this.selectedBranches = [];
    this.cols = [];
    this.pagination = new PaginationParams();
  }
  //#endregion 

  //#region Lifecycle Hooks
  ngOnInit(): void {
    //Permissions
    this.canDelete = this.authSvcs.getUserDetails().permissions.delete;
    this.canCreate = this.authSvcs.getUserDetails().permissions.create;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.isDevloper = this.authSvcs.getUserDetails().role.toLowerCase() === "devloper";
    //Get branch records
    this.getBranches(this.pagination);
    //Single Insert or Update Subscription
    this.branchsubscription = this.branchSvcs.getBranch()
      .subscribe(operation => {
        if (operation?.isSuccess) {
          if (operation.branch) {
            const index = this.branches.findIndex(b => b.branchId === operation.branch?.branchId);
            if (index !== -1) {
              this.branches[index] = operation.branch;
              this.branches = [...this.branches];
              this.messageService.add({ severity: 'success', summary: 'Success', detail: operation.message });
            } else {
              this.branches = [...this.branches, operation.branch];
              this.totalRecords += 1;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: operation.message });
            }
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: operation.message });
          }
        }
      });
    //Bulk Insert or Update Subscription
    this.bulkBranchsubscription = this.branchSvcs.getBulkBranch()
      .subscribe(operation => {
        if (operation?.isSuccess) {
          if (operation?.branches && operation?.branches.length > 0) {
            const updatedBranches = [...this.branches];
            operation?.branches.forEach(newBranch => {
              const existingIndex = updatedBranches.findIndex(b => b.branchId === newBranch.branchId);
              if (existingIndex !== -1) {
                updatedBranches[existingIndex] = newBranch;
              } else {
                updatedBranches.push(newBranch);
              }
            });
            this.branches = [...updatedBranches];
          }
        }
      });
  }
  ngOnDestroy(): void {
    this.branchsubscription?.unsubscribe();
    this.bulkBranchsubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
    this.bulkDeleteSubscription?.unsubscribe();
  }
  //#endregion

  //#region Pagination , Searching , Shorting
  public onGlobalFilter(searchText: HTMLInputElement) {
    this.pagination.searchTerm = searchText.value;
    this.pagination.pageNumber = 0;
    this.getBranches(this.pagination);
  }
  public onPageChange(event: any) {
    this.pagination.pageNumber = event.first / event.rows;
    this.pagination.pageSize = event.rows;
    this.getBranches(this.pagination);
  }
  public clearSearch() {
    this.pagination.searchTerm = '';
    this.getBranches(this.pagination);
  }
  //#endregion

  //#region import, Export, Print
  public onImportClick() {
    this.importOptionsVisible = true;
  }
  public downloadSampleFile() {
    const sampleData = [{
      'Branch Code': 'BR001',
      'Branch Name': 'Sample Branch',
      'Contact Number': '1234567890',
      'Branch Address': 'Sample Address'
    }];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Branches');
    XLSX.writeFile(workbook, 'branch_template.xlsx');
  }
  public importExcelFile(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      const branches: BranchModel[] = data.map((row: any) => {
        const branch = new BranchModel();
        branch.branchCode = row['Branch Code'] || '';
        branch.branchName = row['Branch Name'] || '';
        branch.contactNumber = row['Contact Number']?.toString() || '';
        branch.branchAddress = row['Branch Address'] || '';
        return branch;
      });
      this.branchSvcs.bulkCreateBranch(branches).subscribe({
        next: (response) => {
          if (response.responseCode === 201) {
            const newBranches = response.data.records as BranchDto[];
            this.branches = [...this.branches, ...newBranches];
            this.totalRecords += this.branches.length;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Branches imported successfully' });
            this.importOptionsVisible = false;
          }
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error importing branches' });
        },
        complete: () => {
          this.fileUpload.clear();
        }
      });
    };
    reader.readAsArrayBuffer(file);
  }
  public onExportClick() {
    this.exportOptionsVisible = true;
  }
  private prepareData(data: BranchDto[]) {
    return data.map(branch => ({
      'Branch Code': branch.branchCode,
      'Branch Name': branch.branchName,
      'Contact Number': branch.contactNumber,
      'Address': branch.branchAddress
    }));
  }
  private exportExcel(data: BranchDto[], fileName: string = 'branches') {
    const preparedData = this.prepareData(data);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(preparedData);
    const columnWidths = [
      { wch: 15 }, // Branch Code
      { wch: 25 }, // Branch Name
      { wch: 15 }, // Contact Number
      { wch: 30 }, // Address
    ];
    worksheet['!cols'] = columnWidths;
    // Create workbook and add worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Branches');
    // Save file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
  public exportAsExcel() {
    this.branchSvcs.getAllBranch().subscribe({
      next: (response) => {
        if (response.responseCode === 200) {
          const data = response.data.collectionObjData as BranchDto[];
          this.exportExcel(data, 'branch-list');
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'error', detail: 'Internal Server Error' });
      },
    })
  }
  private exportPdf(data: BranchDto[], fileName: string = 'branches') {
    const preparedData = this.prepareData(data);
    // Initialize PDF document
    const doc = new jsPDF();
    // Define table headers
    const headers = [['Branch Code', 'Branch Name', 'Contact Number', 'Address']];
    // Prepare table data
    const tableData = preparedData.map(item => [
      item['Branch Code'],
      item['Branch Name'],
      item['Contact Number'],
      item['Address']
    ]);
    // Add table to PDF
    autoTable(doc, {
      head: headers,
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 71, 71] },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 80 }
      },
      margin: { top: 20 }
    });
    // Save PDF
    doc.save(`${fileName}.pdf`);
  }
  public exportAsPdf() {
    this.branchSvcs.getAllBranch().subscribe({
      next: (response) => {
        if (response.responseCode === 200) {
          const data = response.data.collectionObjData as BranchDto[];
          this.exportPdf(data, 'branch-list');
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'error', detail: 'Internal Server Error' });
      },
    })
  }
  print() {

  }
  //#endregion

  //#region Client Side Operations
  public addBranch() {
    this.branchSvcs.setOperationType("add");
    this.branchSvcs.showAddUpdateBranchdDialog();
  }
  public editBranch(branch: BranchDto) {
    this.branchSvcs.setOperationType("edit");
    this.branchSvcs.setBranch({ branch, isSuccess: false });
    this.branchSvcs.showAddUpdateBranchdDialog();
  }
  public bulkAddBranch() {
    this.branchSvcs.setBulkOperationType("add");
    this.router.navigate(['branch/bulk-add-update']);
  }
  public bulkEditBranch() {
    this.branchSvcs.setBulkOperationType("edit");
    this.branchSvcs.setBulkBranch({branches : this.selectedBranches, isSuccess: false} );
    this.router.navigate(['branch/bulk-add-update']);
  }
  public recoverBranch() {
    this.router.navigate(['branch/list-recover-branch']);
  }
  //#endregion

  //#region Server Side Operation
  private getBranches(pagination: PaginationParams): void {
    this.loading = true;
    try {
      this.branchSvcs.getBranches(pagination).subscribe({
        next: async (response) => {
          this.loading = false;
          if (response.responseCode === 200) {
            this.branches = response.data.collectionObjData as BranchDto[];
            this.totalRecords = response.data.count;
          }
        },
        error: (err) => {
          this.loading = false;
          if (err.error.responseCode === 404) {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: err.error.message });
          }
          else if (err.error.responseCode === 400) {
            this.messageService.add({ severity: 'error', summary: 'error', detail: `Server Side Eroor: ${err.error.message}` });
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'An unknown error occurred.' });
          }
        },
      })
    }
    catch (err) {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'error', detail: 'An unknown error occurred.' });
    }
  }
  public removeBranch(id: string, event: Event): void {
    this.confirmationService.confirm({
      key: 'removeBranch',
      target: event.target || new EventTarget,
      message: 'Are you sure that you want to Delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.branchSvcs.removeBranch(id).subscribe({
          next: async (response) => {
            if (response.responseCode === 200) {
              this.branches = this.branches.filter(branch => branch.branchId !== id);
              this.totalRecords -= 1;
              if (this.branches.length === 0) {
                this.pagination = new PaginationParams();
                this.getBranches(this.pagination);
              }
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            }
          },
          error: (err) => {
            if (err.error.responseCode === 404) {
              this.messageService.add({ severity: 'info', summary: 'Info', detail: err.error.message });
            }
            else if (err.error.responseCode === 400) {
              this.messageService.add({ severity: 'error', summary: 'error', detail: `Server Side Eroor: ${err.error.message}` });
            }
            else {
              this.messageService.add({ severity: 'error', summary: 'error', detail: 'An unknown error occurred.' });
            }
          }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }
  public bulkRemoveBranch(): void {
    this.confirmationService.confirm({
      key: 'bulkRemoveBranch',
      accept: () => {
        const branchIds = this.selectedBranches.map(branch => branch.branchId);
        this.branchSvcs.bulkRemoveBranch(branchIds).subscribe({
          next: async (response) => {
            if (response.responseCode === 200) {
              this.branches = this.branches.filter(branch => !branchIds.includes(branch.branchId));
              this.selectedBranches = [];
              this.totalRecords -= branchIds.length;
              if (this.branches.length === 0) {
                this.pagination = new PaginationParams();
                this.getBranches(this.pagination);
              }
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            }
          },
          error: (err) => {
            if (err.error.responseCode === 404) {
              this.messageService.add({ severity: 'info', summary: 'Info', detail: err.error.message });
            }
            else if (err.error.responseCode === 400) {
              this.messageService.add({ severity: 'error', summary: 'error', detail: `Server Side Eroor: ${err.error.message}` });
            }
            else {
              this.messageService.add({ severity: 'error', summary: 'error', detail: 'An unknown error occurred.' });
            }
          }
        })
      }
    });
  }
  //#endregion

  //#region Test form
  get branchDtoJson(): string {
    return JSON.stringify(this.branches, null, 2);
  }
  get SeletedDtoJson(): string {
    return JSON.stringify(this.selectedBranches, null, 2);
  }
  //#endregion
}
