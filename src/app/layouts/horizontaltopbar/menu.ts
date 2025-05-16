    import { MenuItem } from './menu.model';

    export const MENU: MenuItem[] = [
        {
            id: 1,
            label: 'MENUITEMS.DASHBOARDS.TEXT',
            icon: 'home',
            link: '/',
        },
        {
            id: 52,
            label: 'MENUITEMS.EXTRAPAGES.TEXT',
            icon: 'file-text',
            subItems: [
                {
                    id: 53,
                    label: 'MENUITEMS.AUTHENTICATION.TEXT',
                    icon: 'users',
                    subItems: [
                        {
                            id: 54,
                            label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN',
                            link: '/account/login',
                            parentId: 53
                        },
                        {
                            id: 55,
                            label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER',
                            link: '/account/register',
                            parentId: 53
                        },
    
                        {
                            id: 56,
                            label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD',
                            link: '/account/recoverpw',
                            parentId: 53
                        },
                        {
                            id: 57,
                            label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
                            link: '/account/look-screen',
                            parentId: 53
                        },
                        {
                            id: 58,
                            label: 'MENUITEMS.AUTHENTICATION.LIST.LOGOUT',
                            link: '/account/logout',
                            parentId: 53
                        },
                        {
                            id: 59,
                            label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL',
                            link: '/account/confirm-mail',
                            parentId: 53
                        },
                        {
                            id: 60,
                            label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION',
                            link: '/account/email-verification',
                            parentId: 53
                        },
                        {
                            id: 61,
                            label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION',
                            link: '/account/two-step-verification',
                            parentId: 53
                        }
                    ]
                },
                {
                    id: 62,
                    label: 'MENUITEMS.UTILITY.TEXT',
                    icon: 'file-text',
                    subItems: [
                        {
                            id: 63,
                            label: 'MENUITEMS.PAGES.LIST.STARTER',
                            link: '/pages/starter',
                            parentId: 62
                        },
                        {
                            id: 64,
                            label: 'MENUITEMS.PAGES.LIST.MAINTENANCE',
                            link: '/pages/maintenance',
                            parentId: 62
                        },
                        {
                            id: 65,
                            label: 'Coming Soon',
                            link: '/pages/coming-soon',
                            parentId: 62
                        },
                        {
                            id: 66,
                            label: 'MENUITEMS.PAGES.LIST.TIMELINE',
                            link: '/pages/timeline',
                            parentId: 62
                        },
                        {
                            id: 67,
                            label: 'MENUITEMS.PAGES.LIST.FAQS',
                            link: '/pages/faqs',
                            parentId: 62
                        },
                        {
                            id: 68,
                            label: 'MENUITEMS.PAGES.LIST.PRICING',
                            link: '/pages/pricing',
                            parentId: 62
                        },
                        {
                            id: 69,
                            label: 'MENUITEMS.PAGES.LIST.ERROR404',
                            link: '/pages/404',
                            parentId: 62
                        },
                        {
                            id: 70,
                            label: 'MENUITEMS.PAGES.LIST.ERROR500',
                            link: '/pages/500',
                            parentId: 62
                        },
                    ]
                },
            ]
        }

    ];

