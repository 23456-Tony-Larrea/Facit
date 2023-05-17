export const summaryPageTopMenu = {
	intro: { id: 'intro', text: 'Intro', path: '#intro', icon: 'Vrpano', subMenu: null },
	bootstrap: {
		id: 'bootstrap',
		text: 'Bootstrap Components',
		path: '#bootstrap',
		icon: 'BootstrapFill',
		subMenu: null,
	},
	storybook: {
		id: 'storybook',
		text: 'Storybook',
		path: '#storybook',
		icon: 'CustomStorybook',
		subMenu: null,
	},
	formik: {
		id: 'formik',
		text: 'Formik',
		path: '#formik',
		icon: 'CheckBox',
		subMenu: null,
	},
	apex: {
		id: 'apex',
		text: 'Apex Charts',
		path: '#apex',
		icon: 'AreaChart',
		subMenu: null,
	},
};

export const dashboardPagesMenu = {
	dashboard: {
		id: 'dashboard',
		text: 'Inicio',
		path: '/',
		icon: 'Dashboard',
		subMenu: null,
	},

};

export const demoPagesMenu = {
	pages: {
		id: 'pages',
		text: 'Configuración',
		icon: 'Extension',
	},
	listPages: {
		id: 'listPages',
		text: 'Configuracion',
		path: 'Roles',
		icon: 'BackupTable',
		subMenu: {
			RolesPermiso: {
				id: 'RolesPermiso',
				text: 'Roles y Permisos',
				path: 'Roles',
				icon: 'Person',
			},
			usuarios:{
				id: 'usuarios',
				text: 'Usuarios',
				path: 'Users',
				icon: 'PersonAdd',
			},
			employees: {
				id: 'employees',
				text: 'Empleados',
				path: 'Employees',
				icon: 'PersonAdd',
			},
		}
	},
};
export const loginMenu={
	auth: {
		id: 'auth',
		text: 'Auth Pages',
		icon: 'Extension',
	},
	login: {
		id: 'login',
		text: 'Login',
		path: 'auth-pages/login',
		icon: 'Login',
	},
	signUp: {
		id: 'signUp',
		text: 'Sign Up',
		path: 'auth-pages/sign-up',
		icon: 'PersonAdd',
	},

	page404: {
		id: 'Page404',
		text: 'Error 404',
		path: 'auth-pages/404',
		icon: 'ReportGmailerrorred',
	},
}
export const pageLayoutTypesPagesMenu = {
};

export const componentPagesMenu = {
	
	};
export const productsExampleMenu = {
	companyA: { id: 'companyA', text: 'Company A', path: 'grid-pages/products', subMenu: null },
	companyB: { id: 'companyB', text: 'Company B', path: '/', subMenu: null },
	companyC: { id: 'companyC', text: 'Company C', path: '/', subMenu: null },
	companyD: { id: 'companyD', text: 'Company D', path: '/', subMenu: null },
};
export const menuRole={
role:{
id:"roles"
,text:"Roles"
,path:"roles"
,icon:"AccountTree"
,subMenu:null
},
}
export const demoPagesMenu1 = {
    pages: {
        id: 'pages',
        text: 'Empresas',
        icon: 'Extension',
    },
    listPages: {
        id: 'listPages',
        text: 'Organización',
        path: 'Organización',
        icon: 'Preview',
        subMenu: {
            empresas: {
                id: 'Empresas',
                text: 'Empresas',
                path: 'Empresas',
                icon: 'Apartment',
            },
			Agencias:{
				id: 'agencias',
				text: 'Agencias',
				path: 'Agency',
				icon: 'storefront',
			}
        }
    },
};
