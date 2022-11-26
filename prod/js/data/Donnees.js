import { BDD } from "./BDD.js";
export class Donnees extends BDD {
    constructor() {
        super(...arguments);
        this.contact = {
            mail: "contact@exlineo.com",
            sujet: "Merci de remplir les champs requis",
            alerte: "Attention, il manque des informations dans votre formulaire",
            ok: "Message envoyé"
        };
    }
    /** Set data statics from index */
    static getStatic(i, data) {
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
    static setStatic(i, data) {
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
    setFonds() {
    }
}
Donnees.collections = []; // Liste des collections récupérer de la base
Donnees.fonds = []; // Liste des fonds disponibles (pas utilisé)
Donnees.notices = []; // Notices des collections affichées (pour éviter de recharger les données)
Donnees.noticesFiltrees = []; // Liste des notices après avoir été filtrées
Donnees.page = {};
Donnees.menu = [];
Donnees.config = {}; // Données de configuration
Donnees.lazyObserv = []; // Lazy loading sur les images
