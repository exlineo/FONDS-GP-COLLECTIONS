import { Donnees } from './Donnees.js';
import { Menu } from '../Menu.js';
import { BDD } from './BDD.js';
export class Persistance extends BDD {
    constructor(nav, corps) {
        super();
        this.racine = '';
        this.getConfig(); // Appeler la configuration puis les collections
        // Création du menu (pourquoi c'est là, on sait pas)
        this.menu = new Menu(nav, corps);
        // Récupération des données d'AWS
        this.donnees = new Donnees();
    }
}
