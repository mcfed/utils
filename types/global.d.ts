interface RequestInit {
    responseType?:string;
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

interface CommonResponseJson {
    code: number|string;
    message: string;
    data?: object;
}

 interface GraphqlResponseASResult extends CommonResponseJson {
    data:GraphqlResponseResultData;
}

type PromiseResponse = Promise<Response|CommonResponseJson>;

interface ResponseProcess {
    (res: Response):PromiseResponse;
}

interface defaultPageParams{
    column:number,
    current:number,
    showQuickJumper:boolean,
    pageSize:number,
    total:number,
    field:string,
    pageSizeOptions:object,
    showSizeChanger:boolean,
}
declare namespace NodeJS {
    interface Global {
        fetch: {
            (url: string, options?: RequestInit):  Promise<Response>;
            responseProcess: ResponseProcess;
        }
    }
} 