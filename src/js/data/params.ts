const PARAMS = {
    SERV: "http://vps550598.ovh.net/nemateriarest/",
    // Entête des requêtes
    HEAD: {
        mode: 'cors',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    },
    // Envoyer des données
    setPOST: (b:any) => {
        return {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            body: b
        }
    },
    // Liste des liens pour la gestion des collections et des notices (on gardera que le get à la fin, c'est pour garder)
    COLLECTIONS:{
        GET: 'https://khfcgsgouu3vpzn5bl56mstiiy0qhgpm.lambda-url.eu-west-3.on.aws/',
        ADD : 'https://2bjmd4gcdz3hvsofdyyh72g2y40fqzrb.lambda-url.eu-west-3.on.aws/',
        POST : 'https://bnpioebhjba3tmhvrn3syeeldy0kuoll.lambda-url.eu-west-3.on.aws/',
        DELETE : 'https://kvje4zvlb56gadzdgs5ed7sh7m0ymnhy.lambda-url.eu-west-3.on.aws/',
    },
    NOTICES:{
        GET : 'https://mox5fhvycpu6hfsqyzuqx24itm0swdzv.lambda-url.eu-west-3.on.aws/',    
    }
};
export default PARAMS;