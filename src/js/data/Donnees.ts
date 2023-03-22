import { CollectionI, NoticeI, ConfigI } from "../models/ModelesI.js";
import { BDD } from "./BDD.js";

export class Donnees extends BDD {
    static collections: Array<CollectionI> = []; // Liste des collections récupérer de la base
    static fonds:Array<any> = []; // Liste des fonds disponibles (pas utilisé)
    static notices: any = []; // Notices des collections affichées (pour éviter de recharger les données)
    static noticesFiltrees: Array<NoticeI> = []; // Liste des notices après avoir été filtrées
    static page: any = {};
    static menu: Array<any> = [];
    static config: ConfigI = <ConfigI>{}; // Données de configuration
    static lazyObserv:Array<HTMLElement> = []; // Lazy loading sur les images
    static indexN:number = 0; // Index de la notice en cours
    static lang:any = 'fr'; // Langue en cours sur le site
    static t:any = {}; // Traductions chargées

    contact = {
        mail: "contact@exlineo.com",
        sujet: "Merci de remplir les champs requis",
        alerte: "Attention, il manque des informations dans votre formulaire",
        ok: "Message envoyé"
    }
    /** Set data statics from index */
    static getStatic(i: string, data: any) {
        switch (i) {
            case ('collections'):
                return Donnees.collections;
                break;
            case ('notices'):
                return Donnees.notices;
                break;
            case ('page'):
                return Donnees.page;
                break;
            case ('menu'):
                return Donnees.menu;
                break;
            default:
                break;
        }
    }
    static setStatic(i: string, data: any){
        switch (i) {
            case ('collections'):
                Donnees.collections = data;
                break;
            case ('notices'):
                Donnees.notices = data;
                break;
            case ('page'):
                Donnees.page = data;
                break;
            case ('menu'):
                Donnees.menu = data;
                break;
            default:
                break;
        }
    }
    setFonds(){
        
    }
}