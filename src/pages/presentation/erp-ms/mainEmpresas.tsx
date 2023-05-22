import React, { FC, useState, useEffect } from 'react';
import classNames from 'classnames';
import { FormikHelpers, useFormik } from 'formik';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Icon from '../../../components/icon/Icon';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import data from '../../../common/data/dummyEventsData';
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
import Select from '../../../components/bootstrap/forms/Select';

interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}
interface IEmpresa {
	id: number;
	name: string;
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
	const [empresa, setEmpresa] = useState<IEmpresa[]>([]);
	const [isEditMode, setIsEditMode] = useState(false);
	const ADD_TITLE = 'Nueva Empresa';
	const EDIT_TITLE = 'Editar Empresa';
	const [modalTitle, setModalTitle] = useState('');
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
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
		onSubmit: () => {},
		initialValues: {
			id: undefined,
			id_user: undefined,
			ruc: '',
			business_name: '',
			commercial_name: '',
			email_company: '',
			address: '',
			phone: '',
			web_site: '',
			logo_path: '',
			id_province: undefined,
			id_canton: undefined,
		},
		validate: (values) => {
			const errors: any = {};
			if (!values.id_user) {
				errors.id_user = 'Requerido';
			}
			if (!values.business_name) {
				errors.business_name = 'Requerido';
			}
			if (!values.email_company) {
				errors.email_company = 'Requerido';
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email_company)) {
				errors.email = 'Correo electrónico inválido';
			}
			if (!values.commercial_name) {
				errors.commercial_name = 'Requerido';
			}
			if (!values.web_site) {
				errors.web_site = 'Requerido';
			}
			if (values.ruc.length === 0 || !/^[0-9]{13}$/i.test(values.ruc)) {
				errors.ruc = 'RUC inválido';
			}
			if (!values.phone) {
				errors.phone = 'Requerido';
			} else if (!/^[0-9]{10}$/i.test(values.phone)) {
				errors.phone = 'el numero solo debe contener 10 digitos';
			}
			if (!values.address) {
				errors.address = 'Requerido';
			}
			if (!values.logo_path) {
				errors.logo_path = 'Requerido';
			}
			return errors;
		},
	});

	const getEmpresas = () => {
		axios
			.get(`${API_URL}company`)
			.then((response) => {
				setEmpresa(response.data.data);
				console.log(response.data.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};
	const handleDeleteUser = (id: number) => {
		axios
			.delete(`${API_URL}company/${id}`)
			.then((response) => {
				const updatedUsers = empresa.filter((user) => user.id !== id);
				setEmpresa(updatedUsers);
			})
			.catch((error) => {
				console.log(error);
			});
	};
	useEffect(() => {
		getEmpresas();
	}, []);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const { items, requestSort, getClassNamesFor } = useSortableData(data);

	const addEmpresa = async () => {
		try {
			if (formik.values.id) {
				console.log('this is my id', formik.values.id);
				await axios.put(`${API_URL}company/${formik.values.id}`, {
					ruc: formik.values.ruc,
					business_name: formik.values.business_name,
					commercial_name: formik.values.commercial_name,
					email_company: formik.values.email_company,
					address: formik.values.address,
					phone: formik.values.phone,
					web_site: formik.values.web_site,
					logo_path: formik.values.logo_path,
					id_province: formik.values.id_province,
					id_canton: formik.values.id_canton,
				});
			} else {
				await axios.post(`${API_URL}company`, {
					id_user: formik.values.id_user,
					ruc: formik.values.ruc,
					business_name: formik.values.business_name,
					commercial_name: formik.values.commercial_name,
					email_company: formik.values.email_company,
					address: formik.values.address,
					phone: formik.values.phone,
					web_site: formik.values.web_site,
					logo_path: formik.values.logo_path,
					id_province: formik.values.id_province,
					id_canton: formik.values.id_canton,
				});
			}
			getEmpresas();
			setIsOpenModal(false);
		} catch (error) {
			console.log(error);
		}
	};
	const clearForm = () => {
		formik.resetForm();
	};
	return (
		<>
			<Card style={{ width: '100%' }}>
				<CardHeader borderSize={1}>
					<CardLabel icon='Apartment' iconColor='info'>
						<CardTitle tag='h3' className='font-weight-bold'>
							Empresas
						</CardTitle>
					</CardLabel>
					<CardActions>
						<Button
							color='success'
							icon='Add'
							onClick={() => {
								setIsEditMode(false);
								setModalTitle(ADD_TITLE);
								setIsOpenModal(true);
								formik.resetForm();
							}}>
							Nueva Empresa
						</Button>
					</CardActions>
				</CardHeader>
				<CardBody className='table-responsive' isScrollable={isFluid}>
					<table className='table table-modern text-center'>
						<thead>
							<tr>
								<th>
									<Icon
										icon='ArrowRight'
										size='lg'
										className='ms-1 cursor-help'
									/>
									Nombre
								</th>
								<th>
									<Icon
										icon='ArrowRight'
										size='lg'
										className='ms-1 cursor-help'
									/>
									RUC
								</th>
								<th>
									<Icon
										icon='ArrowRight'
										size='lg'
										className='ms-1 cursor-help'
									/>
									Email
								</th>
								<th>
									<Icon
										icon='ArrowRight'
										size='lg'
										className='ms-1 cursor-help'
									/>
									Direccion
								</th>
								<th>
									<Icon
										icon='ArrowRight'
										size='lg'
										className='ms-1 cursor-help'
									/>
									Sitio Web
								</th>
								<th>
									<Icon
										icon='ArrowRight'
										size='lg'
										className='ms-1 cursor-help'
									/>
									Telefono
								</th>
								<th>Edit</th>
								<td />
							</tr>
						</thead>
						<tbody>
							{dataPagination(empresa, currentPage, perPage).map((item) => (
								<tr key={item.id}>
									<td>{item.business_name}</td>
									<td>{item.ruc}</td>
									<td>{item.email_company}</td>
									<td>{item.address}</td>
									<td>{item.web_site}</td>
									<td>{item.phone}</td>
									<td>
										<Button
											icon='Edit'
											color='primary'
											isLight
											data-tour='filter '
											className='ms-2 m-1'
											aria-label='Edit'
											onClick={() => {
												setIsEditMode(true);
												setModalTitle(EDIT_TITLE);
												setIsOpenModal(true);
												getEmpresas();
												formik.setValues(item);
												formik.setFieldValue('logo_path', item.logo_path);
												formik.setFieldValue('ruc', item.ruc);
												formik.setFieldValue(
													'business_name',
													item.business_name,
												);
												formik.setFieldValue(
													'commercial_name',
													item.commercial_name,
												);
												formik.setFieldValue(
													'email_company',
													item.email_company,
												);
												formik.setFieldValue('address', item.address);
												formik.setFieldValue('phone', item.phone);
												formik.setFieldValue('web_site', item.web_site);
											}}></Button>
										<Button
											isOutline={!darkModeStatus}
											color='danger'
											isLight={darkModeStatus}
											className={classNames('text-nowrap', {
												'border-light': !darkModeStatus,
											})}
											icon='Cancel'
											onClick={() => {
												handleDeleteUser(item.id);
												getEmpresas();
												clearForm();
											}}></Button>
									</td>
								</tr>
							))}
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

			{/* <OffCanvas
				setOpen={setUpcomingEventsEditOffcanvas}
				isOpen={upcomingEventsEditOffcanvas}
				titleId='upcomingEdit'
				isBodyScroll
				placement='end'>
				<OffCanvasHeader setOpen={setUpcomingEventsEditOffcanvas}>
					<OffCanvasTitle id='upcomingEdit'>Permisos</OffCanvasTitle>
				</OffCanvasHeader>
			 <OffCanvasBody>
					<div className='row g-4'>
						<div className='col-12'>
							<Card isCompact borderSize={2} shadow='none' className='mb-0'>
								<CardHeader>
									<CardLabel>
										<Checks
											id='notify'
											type='switch'
											label={
												<>
													<CardTitle>Grupo 1</CardTitle>
													<Popovers
														trigger='hover'
														desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
														<Icon
															icon='none'
															size='lg'
															className='ms-1 cursor-help'
														/>
													</Popovers>
												</>
											}
											onChange={formik.handleChange}
											// checked={formik.values.}
										/>
									</CardLabel>
								</CardHeader>
								<CardBody>
									 {permisos.map((permiso) => (
										<FormGroup key={permiso.id}>
											<Checks
												id='notify'
												type='switch'
												label={
													<>
														{permiso.name}
														<Popovers
															trigger='hover'
															desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
															<Icon
																icon='none'
																size='lg'
																className='ms-1 cursor-help'
															/>
														</Popovers>
													</>
												}
												onChange={formik.handleChange}
												checked={formik.values.notify}
											/>
										</FormGroup>
									))} 
								</CardBody>
							</Card>
						</div>
					</div>
				</OffCanvasBody> 
				<div className='row m-0'>
					<div className='col-12 p-3'>
						<Button
							color='info'
							className='w-100'
							onClick={() => setUpcomingEventsEditOffcanvas(false)}>
							Agregar
						</Button>
					</div>
				</div>
			</OffCanvas> */}
			<Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal}>
				<ModalHeader setIsOpen={setIsOpenModal}>
					<ModalTitle id='tour-title' className='d-flex align-items-end'>
						<span className='ps-2'>
							<h3 className='text-center'>{modalTitle}</h3>
						</span>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row'>
						<div className='col-md-12 d-flex align-items-center justify-content-center'>
							<div>
								{/* <Card>
									<CardHeader>
										<CardLabel icon='Apartment'>
											<CardTitle>Empresa</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<Select
											id='province'
											size='lg'
											ariaLabel='Category'
											placeholder='Provincia'
											className={classNames('rounded-1', {
												'bg-white': !darkModeStatus,
											})}
										/>
										<Select
											id='canton'
											size='lg'
											ariaLabel='Category'
											placeholder='Cantón'
											className={classNames('rounded-1', {
												'bg-white': !darkModeStatus,
											})}
										/>
										<Select
											id='users'
											size='lg'
											ariaLabel='Category'
											placeholder='Usuarios'
											className={classNames('rounded-1', {
												'bg-white': !darkModeStatus,
											})}
										/>
									</CardBody>
								</Card> */}
							</div>
						</div>
						<div className='row'>
							<div className='col-md-12 d-flex align-items-center justify-content-center'>
								<Card className='col-md-10'>
									<CardBody>
										{/* <FormGroup
											id='province'
											label='Provincia'
											className='col-md-10'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.id_province}
											/>
										</FormGroup>
										<FormGroup id='canton' label='Cantón' className='col-md-10'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.id_province}
											/>
										</FormGroup>
										<FormGroup
											id='users'
											label='Usuarios'
											className='col-md-10'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.id_province}
											/>
										</FormGroup> */}

										<FormGroup
											id='ruc'
											isFloating
											label='RUC'
											className='col-md-10'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.ruc}
												invalidFeedback={formik.errors.ruc}
												isTouched={formik.touched.ruc}
												validFeedback='Perfecto!'
												isValid={formik.isValid}
												onBlur={formik.handleBlur}
											/>
										</FormGroup>

										<FormGroup
											id='business_name'
											label='Nombre Empresa'
											isFloating
											className='col-md-10'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.business_name}
												invalidFeedback={formik.errors.business_name}
												isTouched={formik.touched.business_name}
												validFeedback='Perfecto!'
												isValid={formik.isValid}
												onBlur={formik.handleBlur}
											/>
										</FormGroup>
										<FormGroup
											id='commercial_name'
											label='Nombre Comercial'
											isFloating
											className='col-md-10'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.commercial_name}
												invalidFeedback={formik.errors.commercial_name}
												isTouched={formik.touched.commercial_name}
												validFeedback='Perfecto!'
												isValid={formik.isValid}
												onBlur={formik.handleBlur}
											/>
										</FormGroup>
										<FormGroup
											id='email_company'
											label='Email'
											isFloating
											className='col-md-10'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.email_company}
												invalidFeedback={formik.errors.email_company}
												isTouched={formik.touched.email_company}
												validFeedback='Perfecto!'
												isValid={formik.isValid}
												onBlur={formik.handleBlur}
											/>
										</FormGroup>
										<FormGroup
											id='address'
											label='Direccion'
											isFloating
											className='col-md-10'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.address}
												invalidFeedback={formik.errors.address}
												isTouched={formik.touched.address}
												validFeedback='Perfecto!'
												isValid={formik.isValid}
												onBlur={formik.handleBlur}
											/>
										</FormGroup>
										<FormGroup
											id='phone'
											label='Telefono'
											isFloating
											className='col-md-10'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.phone}
												invalidFeedback={formik.errors.phone}
												isTouched={formik.touched.phone}
												validFeedback='Perfecto!'
												isValid={formik.isValid}
												onBlur={formik.handleBlur}
											/>
										</FormGroup>
										<FormGroup
											id='logo_path'
											label='Imagen'
											isFloating
											className='col-md-10'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.logo_path}
												invalidFeedback={formik.errors.logo_path}
												isTouched={formik.touched.logo_path}
												validFeedback='Perfecto!'
												isValid={formik.isValid}
												onBlur={formik.handleBlur}
											/>
										</FormGroup>
									</CardBody>
								</Card>
							</div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button
						icon='Close'
						color='danger'
						isLink
						onClick={() => setIsOpenModal(false)}>
						Cancelar
					</Button>
					<Button
						icon='Save'
						color='success'
						isLight
						onClick={() => {
							addEmpresa();
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
