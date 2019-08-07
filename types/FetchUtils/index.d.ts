interface RequestInit {
    responseType:string;
}

interface Response {
    code?: number|string;
}

interface FetchConfig {
    responseProcess?(): any;
    fetch?(): any;
}

interface GraphqlParams {
    column?:number;
    current?:number;
    showQuickJumper?:boolean;
    pageSize?:number;
    total?:number;
    field?:string;
    pageSizeOptions?:any;
    showSizeChanger?:any;
    columnKey?:string;
    order?:string;
    otherParam?:any;
}

interface GraphqlResponseResultData {
    result:object;
}

interface GraphqlResponseASResult {
    code:number;
    data:GraphqlResponseResultData;
}

