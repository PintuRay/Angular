export class PaginationParams {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
    constructor() {
        this.pageNumber = 0;
        this.pageSize = 0;
        this.searchTerm = ''
    }
}