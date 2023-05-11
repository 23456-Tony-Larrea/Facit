import React, { useState } from 'react';
import Button from '../../../components/bootstrap/Button';
import ListGroup from '../../../components/bootstrap/ListGroup';
import ListGroupItem from '../../../components/bootstrap/ListGroup';
import s from '../../../../src/modules/MainRoles.module.css';
import swal from 'sweetalert2';

interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}
interface IRole {
	id: number;
	name: string;
}
const CommonUpcomingEvents: FC<ICommonUpcomingEventsProps> = ({ isFluid }) => {
	const token = localStorage.getItem("user_token");
axios.interceptors.request.use(
(config) => {
config.headers.authorization = `Bearer ${token}`;
return config;
},
(error) => {
if (error.response.status === 401) {
localStorage.removeItem("token");
}
}
);
	const { themeStatus, darkModeStatus } = useDarkMode();
	const [roles, setRoles] = useState<IRole[]>([]);

	// BEGIN :: Upcoming Events
	const [upcomingEventsInfoOffcanvas, setUpcomingEventsInfoOffcanvas] = useState(false);
	const handleUpcomingDetails = () => {
		setUpcomingEventsInfoOffcanvas(!upcomingEventsInfoOffcanvas);
	};

	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false);
	const handleUpcomingEdit = () => {
		setUpcomingEventsEditOffcanvas(!upcomingEventsEditOffcanvas);
	};
	// END :: Upcoming Events

	const formik = useFormik({
		onSubmit<Values>(
			values: Values,
			formikHelpers: FormikHelpers<Values>,
		): void | Promise<any> {
			return undefined;
		},
		initialValues: {
			roleName: '',
			notify: true,
		},
	});
	useEffect(() => {
		axios.get(`${API_URL}roles`)
		.then(response => {
		setRoles(response.data.data);
		console.log(response.data.data);
		
		})
		.catch(error => {
		console.log(error);
		});
		}, []);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const { items, requestSort, getClassNamesFor } = useSortableData(data);
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);


	return (
		<div className={`container ${s.container}`}>
			<div className='row'>
				<div className={`col-md-6 ${s.col}`}>
					<h2 className={s.TituloRolePermiso}>
						<i className='bi bi-person-rolodex'> </i>Roles
					</h2>
					<ListGroup>
						{roles.map((role) => (
							<ListGroupItem className={s.divconCheckBox} key={role}>
								<i className='bi bi-caret-right-fill'>
									<span> {role}</span>
								</i>
							</ListGroupItem>
						))}
					</ListGroup>
					<Button className={s.buttonRole} color='info' onClick={handleAddRole}>
						<i className='bi bi-plus-lg'> Agregar Roles</i>
					</Button>
				</div>
				<div className={`col-md-6 ${s.col}`}>
					<h2 className={s.TituloRolePermiso}>
						<i className='bi bi-ui-checks'> </i>Permisos
					</h2>
					<ListGroup>
						{permissions.map((permission, index) => (
							<ListGroupItem key={index}>
								<div className={s.divconCheckBox}>
									<i className='bi bi-caret-right-fill'>
										{` Permiso ${index + 1}`}{' '}
									</i>
									<label className={s.switch}>
										<input
											type='checkbox'
											checked={permission}
											onChange={() => handlePermissionToggle(index)}
											className={s.checkbox}
										/>
										<span className={s.slider}></span>
									</label>
								</div>
							</ListGroupItem>
						))}
					</ListGroup>
				</div>
			</OffCanvas>
						<Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal} titleId='tour-title'>
			<ModalHeader setIsOpen={setIsOpenModal}>
			<ModalTitle id='tour-title' className='d-flex align-items-end'>
			<span className='ps-2'>
			<Icon icon='Verified' color='info' />
			</span>
			</ModalTitle>
			</ModalHeader>
			<ModalBody>
			<div className='row'>

			<div className='col-md-9 d-flex align-items-center'>
			<div>
			<h2>Agregar Roles</h2>
			<Input
            type='text'
            id='roleName'
            name='roleName'
            onChange={formik.handleChange}
        	value={formik.values.roleName}
          />
			</div>
			</div>
			</div>
			</ModalBody>
			<ModalFooter>
			<Button icon='Close' color='danger' isLink onClick={() => setIsOpenModal(false)}>
			Cancelar
			</Button>
			<Button
			icon='Save'
			color='success'
			isLight
			onClick={() => {
			setIsOpenModal(false);
			}}>
			Guardar
			</Button>
			</ModalFooter>
			</Modal>
		</>
	);
};

export default CommonUpcomingEvents;
