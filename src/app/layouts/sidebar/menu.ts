import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'home',
        link: '/',
    },
    {
        id: 3,
        label: 'MENUITEMS.PARKINGS.TEXT',
        icon: 'sliders',
        link: '/parking'
    },
    { 
        id: 5,
        label: 'MENUITEMS.VEHICULES.TEXT',
        icon: 'cpu',
        link: '/vehicule'
    },
    { 
        id: 5,
        label: 'MENUITEMS.HISTORIQUES.TEXT',
        icon: 'pie-chart',
        link: '/historique'
    },
    {
        id: 16,
        label: 'MENUITEMS.PARAMETRES.TEXT',
        icon: 'settings',
        subItems: [
            {
                id: 17,
                label: 'MENUITEMS.UTILISATEURS.TEXT',
                link: '/utilisateur'
            },
            {
                id: 18,
                label: 'MENUITEMS.TYPE-ACCOUNTS.TEXT',
                link: '/parametre/type-account'
            },
            {
                id: 19,
                label: 'MENUITEMS.ACCOUNTS.TEXT',
                link: '/parametre/account'
            },
            {
                id: 20,
                label: 'MENUITEMS.LOCALITES.TEXT',
                link: '/parametre/localite'
            },
            {
                id: 18,
                label: 'MENUITEMS.TYPE-PAIEMENTS.TEXT',
                link: '/parametre/type-paiement'
            },
            {
                id: 18,
                label: 'MENUITEMS.PAIEMENTS.TEXT',
                link: '/parametre/paiement'
            },
            {
                id: 18,
                label: 'MENUITEMS.CONTACTS.TEXT',
                link: '/parametre/contact'
            },
        ]
    },
];

