import { ConfigI } from "../models/ModelesI.js";
import { BDD } from "./BDD.js";

export class Donnees extends BDD {
    static collections: Array<any> = [];
    static notices: Array<any> = [];
    static page: any = {};
    static menu: Array<any> = [];

    config:ConfigI = <ConfigI>{}; // Stocker les données de configuration comme les adresses de connexion

    contact = {
        mail: "contact@exlineo.com",
        sujet: "Merci de remplir les champs requis",
        alerte: "Attention, il manque des informations dans votre formulaire",
        ok: "Message envoyé"
    }
    /** Set data statics from index */
    getStatic(i: string, data: any) {
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
}