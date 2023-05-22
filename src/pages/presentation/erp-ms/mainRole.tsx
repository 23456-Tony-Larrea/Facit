import React, { FC, useState, useEffect } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { FormikHelpers, useFormik } from 'formik';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import { priceFormat } from '../../../helpers/helpers';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Icon from '../../../components/icon/Icon';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Checks from '../../../components/bootstrap/forms/Checks';
import Popovers from '../../../components/bootstrap/Popovers';
import data from '../../../common/data/dummyEventsData';
import USERS from '../../../common/data/userDummyData';
import EVENT_STATUS from '../../../common/data/enumEventStatus';
import Avatar from '../../../components/Avatar';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import useDarkMode from '../../../hooks/useDarkMode';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../components/bootstrap/Modal';
import axios from 'axios';
import { API_URL } from '../../../constants';

interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}
interface IRole {
	id: number;
	name: string;
}

interface IPermisos {
	id: number;
	id_rol: {
		id: number;
		name: string;
	};
	id_permission: {
		name: string;
		description: string;
	};
	id_group: {
		id: number;
		name: string;
	};
	status: string;
}
const CommonUpcomingEvents: FC<ICommonUpcomingEventsProps> = ({ isFluid }) => {
	const token = localStorage.getItem('user_token');
	axios.interceptors.request.use(
		(config) => {
			config.headers.authorization = `Bearer ${token}`;
			return config;
		},
		(error) => {
			if (error.response.status === 401) {
				localStorage.removeItem('token');
			}
		},
	);
	const { themeStatus, darkModeStatus } = useDarkMode();
	const [roles, setRoles] = useState<IRole[]>([]);
	const ADD_TITLE = 'Agregar Roles';
	const EDIT_TITLE = 'Editar Roles';
	const [modalTitle, setModalTitle] = useState('');
	const [isEditMode, setIsEditMode] = useState(false);
	const [perName, setPerName] = useState('');
	const [status, setStatus] = useState(false);
	const [permisos, setPermisos] = useState<IPermisos[]>([]);

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
			roleId: undefined,
			roleName: '',
			notify: undefined,
			require: true,
		},
		validate: (values) => {
			const errors: any = {};
			if (!values.roleName) {
				errors.roleName = 'Requerido';
			}
			return errors;
		},
	});
	const llamadoRoles = async () => {
		const resp = await axios.get(`${API_URL}roles`);
		setRoles(resp.data.data);
		console.log(resp.data.data);
	};
	const llamadoPermision = async () => {
		const resp = await axios.get(`${API_URL}roles_permissions`);
		setPermisos(resp.data.data);
		console.log(resp.data.data);
	};
	const changeStatus = async (id: number, e: number) => {
		setStatus(e > 0);
		const resp = await axios.put(`${API_URL}roles_permissions/status/${id}`, {
			status: e,
		});
		console.log(resp);
	};
	useEffect(() => {
		llamadoRoles();
		llamadoPermision();
	}, [perName, status]);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const { items, requestSort, getClassNamesFor } = useSortableData(data);
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
	const clearName = () => {
		formik.setFieldValue('roleName', '');
		formik.errors.roleName = '';
	};
	const addRoles = async () => {
		try {
			if (isEditMode) {
				if (!formik.values.roleId) {
					console.log('roleId is not defined'); // Mostrar mensaje de error si roleId no está definido
					return;
				}
				await axios.put(`${API_URL}roles/${formik.values.roleId}`, {
					name: formik.values.roleName,
				});
			} else {
				await axios.post(`${API_URL}roles`, { name: formik.values.roleName });
			}
			llamadoRoles();
			setIsOpenModal(false);
		} catch (error) {
			console.log(error);
		}
	};
	const onChangeName = (e: string) => {
		setPerName(e);
	};
	const deleteRole = async (roleId: number | undefined) => {
		try {
			if (roleId) {
				await axios.delete(`${API_URL}roles/${roleId}`);
				llamadoRoles();
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<Card style={{ width: '100%' }}>
				<CardHeader borderSize={1}>
					<CardLabel icon='SafetyDivider' iconColor='info'>
						<CardTitle>Roles y Permisos</CardTitle>
					</CardLabel>
					<CardActions>
						<Button
							color='success'
							icon='personAdd'
							onClick={() => {
								setIsOpenModal(true);
								setModalTitle(ADD_TITLE);
								clearName();
							}}>
							Agregar
						</Button>
					</CardActions>
				</CardHeader>
				<CardBody
					className='table-responsive'
					style={{ width: '100%', overflowX: 'auto' }}
					isScrollable={isFluid}>
					<table className='table table-modern text-center'>
						<thead>
							<tr>
								<th className='col-sm-3'>
									<h4>Roles y Acciones</h4>
								</th>
								<th className='col-sm-10'>
									<h4>Permisos</h4>
								</th>
								<th></th>
								<td />
							</tr>
						</thead>
						<tbody>
							{dataPagination(roles, currentPage, perPage).map((item) => {
								if (item.name === 'SuperAdministrador') {
									return null; // Si es el rol "superadministrador", no se renderiza la fila
								}

								return (
									<tr key={item.id}>
										<td>
											<div className='d-flex  align-items-center'>
												<div className='text-nowrap'>{item.name}</div>
												<div className='ms-auto'></div>

												<Button
													icon='Edit'
													color='primary'
													isLight
													data-tour='filter '
													className='ms-2'
													aria-label='Edit'
													onClick={() => {
														item;
														setIsOpenModal(true);
														setModalTitle(EDIT_TITLE);
														setIsEditMode(true);
														formik.setFieldValue('roleId', item.id);
														formik.setFieldValue('roleName', item.name);
													}}></Button>
												<Button
													isLight
													data-tour='filter '
													icon='Delete'
													color='danger'
													className='ms-5'
													aria-label='Delete'
													onClick={() => {
														deleteRole(item.id);
													}}></Button>
											</div>
										</td>
										<td>
											<Button
												isOutline={!darkModeStatus}
												color='dark'
												isLight={darkModeStatus}
												className={classNames('text-nowrap', {
													'border-light': !darkModeStatus,
												})}
												icon='RemoveRedEye'
												onClick={() => {
													setPerName(item.name), handleUpcomingEdit();
												}}>
												Ver Permisos
											</Button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</CardBody>
				<PaginationButtons
					data={items}
					label='items'
					setCurrentPage={setCurrentPage}
					currentPage={currentPage}
					perPage={perPage}
					setPerPage={setPerPage}
				/>
			</Card>
			<OffCanvas
				setOpen={setUpcomingEventsEditOffcanvas}
				isOpen={upcomingEventsEditOffcanvas}
				titleId='upcomingEdit'
				isBodyScroll
				placement='end'>
				<OffCanvasHeader setOpen={setUpcomingEventsEditOffcanvas}>
					<OffCanvasTitle id='upcomingEdit'>
						{/* {perName.length > 0 && perName} */}
					</OffCanvasTitle>
					<Popovers
						trigger='hover'
						desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
						<Icon icon='none' size='lg' className='ms-1 cursor-help' />
					</Popovers>
				</OffCanvasHeader>
				<OffCanvasBody>
					<div className='row g-4'>
						<div className='col-12'>
							<Card isCompact borderSize={2} shadow='none' className='mb-0 '>
								<CardHeader>
									<CardLabel>
										<CardTitle className='p-1'>
											{perName.length > 0 && perName}
										</CardTitle>
										{/* <Checks
											id='notify'
											type='switch'
											label={
												<>
												</>
											}
											onChange={formik.handleChange}
											checked={formik.values.notify}
										/> */}
									</CardLabel>
								</CardHeader>
								<CardBody>
									{permisos.map((permiso) => (
										<FormGroup key={permiso.id}>
											{perName === permiso.id_rol.name ? (
												<>
													<Checks
														id='notify'
														type='switch'
														label={permiso.id_permission.description}
														onChange={() => {
															changeStatus(
																permiso.id,
																permiso.status ? 0 : 1,
															);
															llamadoPermision();
														}}
														checked={permiso.status}
														style={{ cursor: 'pointer' }}
													/>
												</>
											) : (
												<> </>
											)}
										</FormGroup>
									))}
								</CardBody>
							</Card>
						</div>
					</div>
				</OffCanvasBody>
			</OffCanvas>
			<Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal}>
				<ModalHeader setIsOpen={setIsOpenModal}>
					<ModalTitle id='tour-title' className='d-flex align-items-end'>
						<h1 className='ps-2 text-center'>
							<h2 className='text-center'>{modalTitle}</h2>
						</h1>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row'>
						<div className='col-md-9 d-flex align-items-center'>
							<div>
								<Input
									type='text'
									id='roleName'
									name='roleName'
									style={{ width: '210%' }}
									onChange={formik.handleChange}
									value={formik.values.roleName}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.roleName}
									invalidFeedback={formik.errors.roleName}
									validFeedback='Perfecto!'
								/>
							</div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button
						icon='Close'
						color='danger'
						isLink
						onClick={() => {
							clearName();
							setIsOpenModal(false);
						}}>
						Cancelar
					</Button>
					<Button
						icon='Save'
						color='success'
						isLight
						isDisable={Object.keys(formik.errors).length > 0}
						onClick={() => {
							addRoles();
							setIsOpenModal(false);
							clearName();
						}}>
						Guardar
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
};

export default CommonUpcomingEvents;
