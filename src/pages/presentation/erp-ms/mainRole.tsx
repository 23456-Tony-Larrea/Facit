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
import { Try } from '../../../components/icon/material-icons';
import { string } from 'prop-types';

interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}
interface IRole {
	id: number;
	name: string;
}

interface IPermisos {
	id: number;
	id_permission: {
		name: string;
		description: string;
	};
	id_group: {
		id: number;
		name: string;
	};
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
	const [perName, setPerName] = useState('');
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
			roleName: '',
			notify: true,
		},
	});
	const llamadoRoles = async () => {
		const resp = await axios.get(`${API_URL}roles`);
		setRoles(resp.data.data);
		// console.log(resp);
	};
	const llamadoPermision = async () => {
		const resp = await axios.get(`${API_URL}roles_permissions`);
		setPermisos(resp.data.data);
		console.log(resp.data.data);
	};

	useEffect(() => {
		llamadoRoles();
		llamadoPermision();
	}, [perName]);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const { items, requestSort, getClassNamesFor } = useSortableData(data);
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
	const onChangeName = (e: string) => {
		setPerName(e);
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
							onClick={() => setIsOpenModal(true)}>
							Agregar
						</Button>
					</CardActions>
				</CardHeader>
				<CardBody className='table-responsive' isScrollable={isFluid}>
					<table className='table table-striped'>
						<thead>
							<tr>
								<th>Roles</th>
								<th>Status</th>
								<th>Permisos</th>
								<td />
							</tr>
						</thead>
						<tbody>
							{dataPagination(roles, currentPage, perPage).map((item) => (
								<tr key={item.id}>
									{/* <td>
										<Button
											isOutline={!darkModeStatus}
											color='dark'
											isLight={darkModeStatus}
											className={classNames({
												'border-light': !darkModeStatus,
											})}
											icon='Info'
											onClick={handleUpcomingDetails}
											aria-label='Detailed information'
										/>
									</td> */}

									<td>
										<div className='d-flex'>
											<div className='flex-grow-1 ms-3 d-flex align-items-center text-nowrap'>
												{item.name}
											</div>
										</div>
									</td>

									{/* <td>
										<Dropdown>
											<DropdownToggle hasIcon={false}>
												<Button
													isLink
													color={item.status.color}
													icon='Circle'
													className='text-nowrap'>
													{item.status.name}
												</Button>
											</DropdownToggle>
											<DropdownMenu>
												{Object.keys(EVENT_STATUS).map((key) => (
													<DropdownItem key={key}>
														<div>
															<Icon
																icon='Circle'
																color={EVENT_STATUS[key].color}
															/>
															{EVENT_STATUS[key].name}
														</div>
													</DropdownItem>
												))}
											</DropdownMenu>
										</Dropdown>
									</td> */}
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
												onChangeName(item.name);
												handleUpcomingEdit();
											}}>
											Ver Permisos
										</Button>
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
							<Card isCompact borderSize={2} shadow='none' className='mb-0'>
								<CardHeader>
									<CardLabel>
										<Checks
											id='notify'
											type='switch'
											label={
												<>
													<CardTitle>
														{perName.length > 0 && perName}
													</CardTitle>
												</>
											}
											onChange={formik.handleChange}
											checked={formik.values.notify}
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
														{permiso.id_permission.description}
														<Popovers
															trigger='hover'
															desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
															<Icon
																icon='none'
																size='md'
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
				{/* <div className='row m-0'>
					<div className='col-12 p-3'>
						<Button
							color='info'
							className='w-100'
							onClick={() => setUpcomingEventsEditOffcanvas(false)}>
							Agregar
						</Button>
					</div>
				</div> */}
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
