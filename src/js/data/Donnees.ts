import { CollectionI, NoticeI, ConfigI } from "../models/ModelesI.js";
import { BDD } from "./BDD.js";

export class Donnees extends BDD {
    static collections: Array<CollectionI> = [];
    static fonds:Array<any> = [];
    static notices: Array<NoticeI> = [];
    static page: any = {};
    static menu: Array<any> = [];
    static config: ConfigI = <ConfigI>{};
    static lazyObserv:Array<HTMLElement> = [];
    
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