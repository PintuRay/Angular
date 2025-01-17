export class PaginationParams {
    pageNumber: number;
    pageSize: number;
    searchTerm: string | null;
    constructor() {
        this.pageNumber = 0;
        this.pageSize = 10;
        this.searchTerm = null;
    }
}