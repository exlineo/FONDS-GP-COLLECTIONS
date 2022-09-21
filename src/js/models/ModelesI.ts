import { NemaSerieI, DocumentI } from "./DocumentsI";

/** Configuration */
export interface ConfigI{
    g:any; // Tous les liens pour obtenir les données
    contact?:any; // Les informations de contact
}
/** Notices génériques */
export interface NoticeI {
    _id?:any;
    date?:any;
    prefix?:string | Array<string>;
    metadonnees:any;
    selected?:boolean;
}
/** Modèle d'une collection */
export interface CollectionI{
    idcollections?: any;
    title: string;
    alias: string;
    description: string;
    type: string;
    creator: string;
    fund?:string;
    language?: string;
    date?:string | number;
    group?: Array<string>;
    notices?:Array<string>;
    series?:Array<NemaSerieI>;
    selected?:boolean;
}
/** Modèle d'un Set de données */
export interface SetI {
    _id?:string | number;
    titre:string;
    alias:string;
    fonds:string;
    origine:{dir:string,url:string};
    description?:string;
    date?:string | number;
    createur?:string;
    gestionnaire?:string;
    documents:Array<DocumentI>;
    prefix:Array<string>;
}