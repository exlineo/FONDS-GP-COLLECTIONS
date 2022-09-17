export interface DocumentI{
    _id?:any;
    date?:any;
    dublincore:DocDublinI;
    gps?:DocGpsI;
    media:DocMediaI;
    nemateria:NemateriaI;
}
export interface DocDublinI {
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
export interface DocGpsI {
    lattitude:number | string;
    longitude:number | string;
    altitude:number | string;
}
export interface DocMediaI {
    format: string;
    imageHeight?:number;
    imageSize?:string;
    imageWidth?:number;
    slicesGroupName:string;
    sourceFile:string;
    file:string;
}
export interface NemateriaI{
    collection?:NemaCollectionI;
    document:NemaDocumentI;
    informateur?:NemaInformateurI | Array<NemaInformateurI>;
    participants?:NemaParticipantI | Array<NemaParticipantI>;
    relations?:NemaRelationsI | Array<NemaRelationsI>;
    sequences?:NemaSequencesI | Array<NemaSequencesI>;
    serie?:NemaSerieI;
}
export interface NemaInformateurI{
    alias_informateur:string;
    competence_informateur:string;
    date_naissance_informateur?:string;
    informateur:string;
}
export interface NemaDocumentI{
    identifiant_unique:string;
    reference_original?:string;
    uri:string;
    url:string;
    sourceFile:string;
    conditions_acces?:string;
    conservateur_fichiers?:string;
    date_creation_original?:string;
    date_numerisation?:string;
    detenteur_droits?:string;
    nature_support_original?:string;
}
export interface NemaCollectionI{
    nom_collection:string;
    proprietaire_originaux?:string;
    qui_numerise?:string;
    gestionnaire_collection?:string;
    detenteur_droits?:string;
    conservateur_originaux?:string;
    conservateur_fichiers?:string;
    fonds?:string;
}
export interface NemaParticipantI{
    editeur_oeuvre_source?:string;
    editeur_site?:string;
    participants:string;
    producteurs?:string;
}
export interface NemaRelationsI{
    contient_elements?:string | Array<string>;
    liens_docs_externes?:string | Array<string>;
    liens_docs_internes:string | Array<string>;
    requiert_documents?:string | Array<string>;
}
export interface NemaSequencesI{
    duree_sequence:string;
    marques_evenements?:string | Array<string>;
    mots_cles_sequences:string | Array<string>;
    resume_sequence?:string;
    sequence:string;
    time_code:string | number;
}
export interface NemaSerieI{
    serie:string;
    serie_parent?:string;
    ordre_serie:string | number;
}