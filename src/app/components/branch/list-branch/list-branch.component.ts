import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BranchDto, BranchModel } from 'src/app/api/entity/branch';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { BranchService } from 'src/app/api/service/devloper/branch/branch.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileUpload } from 'primeng/fileupload';
import { BranchMessageService } from 'src/app/api/service/devloper/branch/branch-message.service';
import { Subject, takeUntil } from 'rxjs';
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
  public branches: BranchDto[] = [];
  public selectedBranches: BranchDto[] = [];
  public cols: any[] = [];
  public pagination: PaginationParams = new PaginationParams();
  public importOptionsVisible: boolean = false;
  public exportOptionsVisible: boolean = false;
  public totalRecords: number = 0;
  @ViewChild('fileUpload') public readonly fileUpload!: FileUpload;
    private readonly destroy$ = new Subject<void>();
  //#endregion 

  //#region constructor
  constructor(
    private readonly branchSvcs: BranchService,
    private readonly authSvcs: AuthenticationService,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: BranchMessageService,
  ) { }
  //#endregion 

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.canDelete = this.authSvcs.getUserDetails().permissions.delete;
    this.canCreate = this.authSvcs.getUserDetails().permissions.create;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.isDevloper = this.authSvcs.getUserDetails().role.toLowerCase() === "devloper";
    this.getBranches(this.pagination);
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
        // branch.branchAddress = row['Branch Address'] || '';
        return branch;
      });
      this.branchSvcs.bulkCreate(branches).subscribe({
        next: (response) => {
          if (response.responseCode === 201) {
            const newBranches = response.data.records as BranchDto[];
            this.branches = [...this.branches, ...newBranches];
            this.totalRecords += this.branches.length;
            this.messageService.success('Branches imported successfully');
            this.importOptionsVisible = false;
          }
        },
        error: (err) => {
          this.messageService.error('Error importing branches');
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
      //'Address': branch.branchAddress
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
    this.branchSvcs.getAll().subscribe({
      next: (response) => {
        if (response.responseCode === 200) {
          const data = response.data.collectionObjData as BranchDto[];
          this.exportExcel(data, 'branch-list');
        }
      },
      error: (err) => {
        this.messageService.error('Internal Server Error');
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
      // item['Address']
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
    this.branchSvcs.getAll().subscribe({
      next: (response) => {
        if (response.responseCode === 200) {
          const data = response.data.collectionObjData as BranchDto[];
          this.exportPdf(data, 'branch-list');
        }
      },
      error: (err) => {
        this.messageService.error('Internal Server Error');
      },
    })
  }
  print() {

  }
  //#endregion

  //#region Client Side Operations
  public addBranch() {
    this.branchSvcs.setOperationType("add");
    this.router.navigate(['branch/add-update']);
  }
  public editBranch(branch: BranchDto) {
    this.branchSvcs.setOperationType("edit");
    this.branchSvcs.setBranch({ branch, isSuccess: false });
    this.router.navigate(['branch/add-update']);
  }
  public bulkAddBranch() {
    this.branchSvcs.setBulkOperationType("add");
    this.router.navigate(['branch/bulk-add-update']);
  }
  public bulkEditBranch() {
    this.branchSvcs.setBulkOperationType("edit");
    this.branchSvcs.setBulkBranch({ branches: this.selectedBranches, isSuccess: false });
    this.router.navigate(['branch/bulk-add-update']);
  }
  public recoverBranch() {
    this.router.navigate(['branch/list-recover']);
  }
  //#endregion

  //#region Server Side Operation
  private getBranches(pagination: PaginationParams): void {
    this.loading = true;
    this.branchSvcs.get(pagination).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.responseCode === 200) {
          this.branches = response.data.records as BranchDto[];
          this.totalRecords = response.data.count;
        }
      },
      error: (err) => {
        this.loading = false;
      },
    })
  }
  public removeBranch(id: string, event: Event): void {
    this.confirmationService.confirm({
      key: 'removeBranch',
      target: event.target || new EventTarget,
      message: 'Are you sure that you want to Delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.branchSvcs.remove(id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.responseCode === 200) {
              this.branches = this.branches.filter(branch => branch.branchId !== id);
              this.totalRecords -= 1;
              if (this.branches.length === 0) {
                this.pagination = new PaginationParams();
                this.getBranches(this.pagination);
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
  public bulkRemoveBranch(): void {
    this.confirmationService.confirm({
      key: 'bulkRemoveBranch',
      accept: () => {
        this.branchSvcs.bulkRemove(this.selectedBranches).pipe(takeUntil(this.destroy$)).subscribe({
          next:(response) => {
            if (response.responseCode === 200) {
              const removedBranches = response.data.records as BranchDto[];
              const branchIds = removedBranches.map(branch => branch.branchId);
              this.branches = this.branches.filter(branch => !branchIds.includes(branch.branchId));
              this.selectedBranches = [];
              this.totalRecords -= response.data.count;
              if (this.branches.length === 0) {
                this.pagination = new PaginationParams();
                this.getBranches(this.pagination);
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
  get branchDtoJson(): string {
    return JSON.stringify(this.branches, null, 2);
  }
  get SeletedDtoJson(): string {
    return JSON.stringify(this.selectedBranches, null, 2);
  }
  //#endregion
}
