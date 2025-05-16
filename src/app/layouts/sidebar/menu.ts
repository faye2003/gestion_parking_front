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
        id: 16,
        label: 'MENUITEMS.AUTHENTICATION.TEXT',
        icon: 'users',
        subItems: [
            {
                id: 17,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN',
                link: '/account/login1',
                parentId: 16
            },
            {
                id: 18,
                label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER',
                link: '/account/register1',
                parentId: 16
            },

            {
                id: 19,
                label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD',
                link: '/account/recoverpw',
                parentId: 16
            },
            {
                id: 20,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
                link: '/account/lock-screen',
                parentId: 16
            },
            {
                id: 21,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOGOUT',
                link: '/account/logout',
                parentId: 16
            },
            {
                id: 22,
                label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL',
                link: '/account/confirm-mail',
                parentId: 16
            },
            {
                id: 23,
                label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION',
                link: '/account/email-verification',
                parentId: 16
            },
            {
                id: 24,
                label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION',
                link: '/account/two-step-verification',
                parentId: 16
            }
        ]
    },
    {
        id: 25,
        label: 'MENUITEMS.PAGES.TEXT',
        icon: 'file-text',
        subItems: [
            {
                id: 26,
                label: 'MENUITEMS.PAGES.LIST.STARTER',
                link: '/pages/starter',
                parentId: 25
            },
            {
                id: 27,
                label: 'MENUITEMS.PAGES.LIST.MAINTENANCE',
                link: '/pages/maintenance',
                parentId: 25
            },
            {
                id: 28,
                label: 'Coming Soon',
                link: '/pages/coming-soon',
                parentId: 25
            },
            {
                id: 29,
                label: 'MENUITEMS.PAGES.LIST.TIMELINE',
                link: '/pages/timeline',
                parentId: 25
            },
            {
                id: 30,
                label: 'MENUITEMS.PAGES.LIST.FAQS',
                link: '/pages/faqs',
                parentId: 25
            },
            {
                id: 31,
                label: 'MENUITEMS.PAGES.LIST.PRICING',
                link: '/pages/pricing',
                parentId: 25
            },
            {
                id: 32,
                label: 'MENUITEMS.PAGES.LIST.ERROR404',
                link: '/pages/404',
                parentId: 25
            },
            {
                id: 32,
                label: 'MENUITEMS.PAGES.LIST.ERROR500',
                link: '/pages/500',
                parentId: 25
            },
        ]
    },
    {
        id: 82,
        label: 'MENUITEMS.MULTILEVEL.TEXT',
        icon: 'share-2',
        subItems: [
            {
                id: 83,
                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.1',
                link: '#',
                parentId: 82
            },
            {
                id: 83,
                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.2',
                parentId: 82,
                subItems: [
                    {
                        id: 84,
                        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.1',
                        link: '#',
                        parentId: 83,
                    },
                    {
                        id: 85,
                        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.2',
                        link: '#',
                        parentId: 83,
                    }
                ]
            },
        ]
    }
];

