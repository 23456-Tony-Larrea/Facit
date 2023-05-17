import React, { lazy } from 'react';
import {
	componentPagesMenu,
	dashboardPagesMenu,
	demoPagesMenu,
	pageLayoutTypesPagesMenu,
	menuRole,
	loginMenu,
	demoPagesMenu1,
} from '../menu';
import Login from '../pages/presentation/auth/Login';

const LANDING = {
	DASHBOARD: lazy(() => import('../pages/presentation/dashboard/DashboardPage')),
};
const AUTH = {
	PAGE_404: lazy(() => import('../pages/presentation/auth/Page404')),
};
const PAGE_LAYOUTS = {
	HEADER_SUBHEADER: lazy(() => import('../pages/presentation/page-layouts/HeaderAndSubheader')),
	HEADER: lazy(() => import('../pages/presentation/page-layouts/OnlyHeader')),
	SUBHEADER: lazy(() => import('../pages/presentation/page-layouts/OnlySubheader')),
	CONTENT: lazy(() => import('../pages/presentation/page-layouts/OnlyContent')),
	BLANK: lazy(() => import('../pages/presentation/page-layouts/Blank')),
	ASIDE: lazy(() => import('../pages/presentation/aside-types/DefaultAsidePage')),
	MINIMIZE_ASIDE: lazy(() => import('../pages/presentation/aside-types/MinimizeAsidePage')),
};
const PAGE_ROLE = {
	ROLE: lazy(() => import('../pages/presentation/erp-ms/mainRole')),
	USER: lazy(() => import('../pages/presentation/erp-ms/mainUser')),
};
const PAGE_EMPRESA = {
	EMPRESA: lazy(() => import('../pages/presentation/erp-ms/mainEmpresas')),
	AGENCIA: lazy(() => import('../pages/presentation/erp-ms/mainAgency')),
};

const presentation = [
	/**
	 * Landing
	 */
	{
		path: dashboardPagesMenu.dashboard.path,
		element: <LANDING.DASHBOARD />,
		exact: true,
	},
	{
		path: loginMenu.login.path,
		element: <Login />,
		exact: true,
	},
	//My Paths
	{
		path: menuRole.role.path,
		element: <PAGE_ROLE.ROLE />,
		exact: true,
	},
	{
		path: demoPagesMenu.listPages.subMenu.usuarios.path,
		element: <PAGE_ROLE.USER />,
		exact: true,
	},
	{
		path: demoPagesMenu1.listPages.subMenu.empresas.path,
		element: <PAGE_EMPRESA.EMPRESA />,
		exact: true,
	},
	{
		path: demoPagesMenu1.listPages.subMenu.Agencias.path,
		element: <PAGE_EMPRESA.AGENCIA />,
		exact: true,
	},
];
const contents = [...presentation];

export default contents;
