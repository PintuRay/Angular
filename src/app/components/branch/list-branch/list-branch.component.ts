import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Branch, BranchModel } from 'src/app/api/entity/branch';
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
  providers: [ConfirmationService, MessageService],
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
  canDelete: boolean = false;
  canCreate: boolean = false;
  canUpdate: boolean = false;
  isDevloper: boolean = false;
  branchsubscription!: Subscription;
  bulkBranchsubscription!: Subscription
  deleteSubscription!: Subscription;
  bulkDeleteSubscription!: Subscription;
  branches: Branch[];
  selectedBranches: Branch[];
  cols: any[];
  pagination: PaginationParams;
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  importOptionsVisible: boolean = false;
  exportOptionsVisible: boolean = false;
  totalRecords: number = 0;

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
    this.getAllBranch(this.pagination);
    //Single Insert or Update Subscription
    this.branchsubscription = this.branchSvcs.getBranch()
      .subscribe(operation => {
        if (operation?.branch) {
          const index = this.branches.findIndex(b => b.branchId === operation.branch.branchId);
          if (operation.isSuccess) {
            if (index !== -1) {
              this.branches[index] = operation.branch;
              this.branches = [...this.branches];
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Branch updated successfully' });
            } else {
              this.branches = [...this.branches, operation.branch];
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Branch added successfully' });
            }
          }
        }
      });
    //Bulk Insert or Update Subscription
    this.bulkBranchsubscription = this.branchSvcs.getBulkBranch()
      .subscribe(operation => {
        if (operation?.branches && operation?.branches.length > 0) {
          if (operation.isSuccess) {
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

  //#region Client Side Vaildation

  //#endregion

  //#region Pagination , Searching , Shorting
  onGlobalFilter(searchText: HTMLInputElement) {
    this.pagination.searchTerm = searchText.value;
    this.pagination.pageNumber = 0;
    this.getAllBranch(this.pagination);
  }
  onPageChange(event: any) {
    this.pagination.pageNumber = event.first / event.rows;
    this.pagination.pageSize = event.rows;
    this.getAllBranch(this.pagination);
  }
  clearSearch() {
    this.pagination.searchTerm = '';
    this.getAllBranch(this.pagination);
  }
  //#endregion

  //#region import, Export, Print
  onImportClick() {
    this.importOptionsVisible = true;
  }
  downloadSampleFile() {
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
  importExcelFile(event: any) {
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
            const newBranches = response.data.records as Branch[];
            this.branches = [...this.branches, ...newBranches];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Branches imported successfully' });
            this.importOptionsVisible = false;
          }
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error importing branches' });
        },
        complete: () => {
          this.fileUpload.clear();
        }
      });
    };
    reader.readAsArrayBuffer(file);
  }
  onExportClick() {
    this.exportOptionsVisible = true;
  }
  private prepareData(data: Branch[]) {
    return data.map(branch => ({
      'Branch Code': branch.branchCode,
      'Branch Name': branch.branchName,
      'Contact Number': branch.contactNumber,
      'Address': branch.branchAddress
    }));
  }
  exportExcel(data: Branch[], fileName: string = 'branches') {
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
  exportAsExcel() {
    this.branchSvcs.getAllBranch().subscribe({
      next: (response) => {
        if (response.responseCode === 200) {
          const data = response.data.collectionObjData as Branch[];
          this.exportExcel(data, 'branch-list');
        }
      },
      error: (response) => {
        this.messageService.add({ severity: 'error', summary: 'error', detail: 'Internal Server Error' });
      },
    })
  }
  exportPdf(data: Branch[], fileName: string = 'branches') {
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
  exportAsPdf() {
    this.branchSvcs.getAllBranch().subscribe({
      next: (response) => {
        if (response.responseCode === 200) {
          const data = response.data.collectionObjData as Branch[];
          this.exportPdf(data, 'branch-list');
        }
      },
      error: (response) => {
        this.messageService.add({ severity: 'error', summary: 'error', detail: 'Internal Server Error' });
      },
    })
  }
  print(){
    
  }
  //#endregion

  //#region Client Side Operations
  addBranch() {
    this.branchSvcs.setOperationType("add");
    this.branchSvcs.showAddUpdateBranchdDialog();
  }
  editBranch(branch: Branch) {
    this.branchSvcs.setOperationType("edit");
    this.branchSvcs.setBranch(branch);
    this.branchSvcs.showAddUpdateBranchdDialog();
  }
  bulkAddBranch() {
    this.branchSvcs.setBulkOperationType("add");
    this.router.navigate(['branch/bulk-add-update']);
  }
  bulkEditBranch() {
    this.branchSvcs.setBulkOperationType("edit");
    this.branchSvcs.setBulkBranch(this.selectedBranches);
    this.router.navigate(['branch/bulk-add-update']);
  }
  recoverBranch() {
    this.router.navigate(['branch/list-recover-branch']);
  }

  //#endregion

  //#region Server Side Operation
  async getAllBranch(pagination: PaginationParams): Promise<void> {
    try {
      this.branchSvcs.getBranches(pagination).subscribe({
        next: (response) => {
          if (response.responseCode === 200) {
            this.branches = response.data.collectionObjData as Branch[];
            this.totalRecords = response.data.count;
          }
        },
        error: (response) => {
          this.messageService.add({ severity: 'error', summary: 'error', detail: 'Internal Server Error' });
        },
        complete: () => { }
      })
    }
    catch (error) {
      this.messageService.add({ severity: 'error', summary: 'error', detail: 'Some Error Occoured' });
    }
  }
  removeBranch(id: string, event: Event) {
    this.confirmationService.confirm({
      key: 'removeBranch',
      target: event.target || new EventTarget,
      message: 'Are you sure that you want to Delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.branchSvcs.removeBranch(id).subscribe({
          next: (response) => {
            if (response.responseCode === 200) {
              this.branches = this.branches.filter(branch => branch.branchId !== id);
              this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: response.message });
            }
          },
          error: (response) => {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'Some Error Occoured' });
          },
          complete: () => { }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }
  bulkRemoveBranch() {
    this.confirmationService.confirm({
      key: 'bulkRemoveBranch',
      accept: () => {
        const branchIds = this.selectedBranches.map(branch => branch.branchId);
        this.branchSvcs.bulkRemoveBranch(branchIds).subscribe({
          next: (response) => {
            if (response.responseCode === 200) {
              this.branches = this.branches.filter(branch => !branchIds.includes(branch.branchId));
              this.selectedBranches = [];
              this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: response.message });
            }
          },
          error: (response) => {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'Some Error Occoured' });
          },
          complete: () => { }
        })
      }
    });
  }
  //#endregion
}
