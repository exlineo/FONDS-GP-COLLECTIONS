import { NemaSerieI, DocumentI } from "./DocumentsI";

/** Configuration */
export interface ConfigI{
    g:any; // Tous les liens pour obtenir les données
    contact?:any; // Les informations de contact
}
/** Effectuer une recherche dans les notices ou les collections */
export interface SearchI {
    collections:string;
    notices:boolean;
    libre:Array<string>;
}
/** Notices génériques */
export interface NoticeI {
    _id?:any;
    date?:any;
    prefix?:string | Array<string>;
    dc:any;
    nema:any;
    media:any;
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
    funds?:string;
    language?: string;
    date?:string | number;
    notices?:Array<string>;
    series?:Array<string>;
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

/** Forattage d'un document Dublin Core (c'est normé, on peut) */
export interface DublinI {
    contributor?: string | Array<string>;
    coverage?: string;
    creator:string | Array<string>;
    date?: string;
    description?:string | Array<string>;
    format?: string;
    identifier?: string;
    language?: string;
    publisher?: string;
    relation?: string | Array<string>;
    rights?: string | Array<string>;
    source?: string;
    subject?:string | Array<string>;
    title?: string;
    type?: string;
}
/** Données sur les médias */
export interface MediaI{
    size?:number; // Poids du fichier
    ImageWidth:number;
    ImageHeight:number;
    url:string; // Lien HTTP vers le média
    file:string; // Le nom du fichier
}

export interface FiltreI{
    libre:string;
    series:Array<string>;
}