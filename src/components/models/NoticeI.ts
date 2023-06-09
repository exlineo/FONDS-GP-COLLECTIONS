/** Notice */
export interface NoticeI {
    _id?:any;
    date?:any;
    prefix?:string | Array<string>;
    dc:any;
    nema:any;
    media:any;
    selected?:boolean;
}
export interface ConfigI {
    s3:string;
}