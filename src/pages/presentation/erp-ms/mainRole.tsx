import React, { FC, useState,useEffect } from 'react';
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
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import useDarkMode from '../../../hooks/useDarkMode';
import Modal, {ModalBody,ModalFooter,ModalHeader,ModalTitle,} from '../../../components/bootstrap/Modal';
import axios from 'axios';
import { API_URL } from '../../../constants';

interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}
interface IRole{
  roleId: number;
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
  const [isEditMode, setIsEditMode] = useState(false);
  	const ADD_TITLE = 'Agregar Roles';
	const EDIT_TITLE = 'Editar Roles';
	const [modalTitle, setModalTitle] = useState('');

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
			notify: true,
		},
	});
	const getRoles = async () => {
		await axios
		  .get(`${API_URL}roles`)
		  .then(response => {
			setRoles(response.data.data);
			console.log(response.data.data);
		  })
		  .catch(error => {
			console.log(error);
		  });
	  };
	const getPermisos = async () => {
		await axios
		.get(`${API_URL}permissions`)
		.then(response => {
			/* setPermisos(response.data.data); */
			console.log(response.data.data);
		})
		.catch(error => {
			console.log(error);
		});
	};

	useEffect(() => {
		getRoles();
		getPermisos();
		}, []);		
		const addRoles = async () => {
			try {
			  if (isEditMode) {
				if (!formik.values.roleId) {
				  console.log("roleId is not defined"); // Mostrar mensaje de error si roleId no está definido
				  return;
				}
				await axios.put(`${API_URL}roles/${formik.values.roleId}`, { name: formik.values.roleName });
			  } else {
				await axios.post(`${API_URL}roles`, { name: formik.values.roleName });
			  }
			  getRoles();
			  setIsOpenModal(false);
			} catch (error) {
			  console.log(error);
			}
		  };


	
	  const deleteRole = async (roleId: number | undefined) => {
		try {
		  if (roleId) {
			await axios.delete(`${API_URL}roles/${roleId}`);
			getRoles();
		  }
		} catch (error) {
		  console.log(error);
		}
	  };
	
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const { items, requestSort, getClassNamesFor } = useSortableData(data);
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
	const clearName = () => {
		formik.setFieldValue('roleName', '');
	};

	return (
		<>
			<Card style={{ width: '100%', overflowX: 'auto' }}>
				<CardHeader borderSize={1}>
					<CardLabel icon='SafetyDivider' iconColor='info'>
					<CardTitle tag='h4' className='font-weight-bold'>
          Roles y Permisos
        </CardTitle>
						
					</CardLabel>
					<CardActions>
						
						<Button
						color='success'
					icon='personAdd'
				
					onClick={() => {setIsOpenModal(true)
						setModalTitle(ADD_TITLE);
						setIsEditMode(false);
					}
				}
					>
					Agregar
					</Button>
						
					</CardActions>
				</CardHeader>
				<CardBody style={{ width: '100%', overflowX: 'auto' }}>
					<table className='table table-modern '>
						<thead>
							<tr>
								<th className='col-sm-3'><h4>Roles y Acciones</h4></th>
								<th className='col-sm-10'><h4>Permisos</h4></th>
								<th></th>
							</tr>
						</thead>
						<tbody>
  {dataPagination(roles, currentPage, perPage).map((item) => {
    if (item.name === "SuperAdministrador") {
      return null; // Si es el rol "superadministrador", no se renderiza la fila
    }
	
    return (
      <tr key={item.id}>
        <td>
          <div className='d-flex  align-items-center'>
            <div className='text-nowrap'>{item.name}</div>
            <div className='ms-auto'></div>
			
            <Button icon='Edit' color='primary' isLight data-tour='filter ' className='ms-2' aria-label='Edit'  onClick={() => {(item)
						setIsOpenModal(true);
						setModalTitle(EDIT_TITLE);
						setIsEditMode(true);
						formik.setFieldValue('roleId', item.id);
						formik.setFieldValue('roleName', item.name);
					}}>
            </Button>
            <Button isLight data-tour='filter ' icon='Delete' color='danger' className='ms-5' aria-label='Delete' onClick={() => { 
						deleteRole(item.id);

			 }}>
            </Button>
          </div>
        </td>
        <td>
          <Button isOutline={!darkModeStatus} color='dark' isLight={darkModeStatus} className={classNames('text-nowrap', { 'border-light': !darkModeStatus })} icon='RemoveRedEye' onClick={handleUpcomingEdit}>
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
					<OffCanvasTitle id='upcomingEdit'>Permisos</OffCanvasTitle>

				</OffCanvasHeader>
				<OffCanvasBody>
					<div className='row g-4'>
						
						<div className='col-12'>
							<Card isCompact borderSize={2} shadow='none' className='mb-0'>
								<CardHeader>
									<CardLabel >
										<CardTitle>Grupo 1</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<FormGroup >
										<Checks
											id='notify'
											type='switch'
											label={
												<>
												
													Permiso 1
													<Popovers
														trigger='hover'
														desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
														<Icon
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
								</CardBody>
							</Card>
						</div>
					</div>
				</OffCanvasBody>
				<div className='row m-0'>
					<div className='col-12 p-3'>
					
					</div>
				</div>
			</OffCanvas>
						<Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal}>
			<ModalHeader setIsOpen={setIsOpenModal}>
			<ModalTitle id='tour-title' className='d-flex align-items-end'>
			<span className='ps-2'>
			<h3 className=''>{modalTitle}</h3>			
			</span>
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
			style={{width: '230%'}}
            onChange={formik.handleChange}
        	value={formik.values.roleName}
          />
			</div>
			</div>
			</div>
			</ModalBody>
			<ModalFooter>
			<Button icon='Close' color='danger' isLink onClick={() => {
				clearName();
				setIsOpenModal(false)}}>
			Cancelar
			</Button>
			<Button
			icon='Save'
			color='success'
			isLight
			onClick={() => {
				addRoles();
				setIsOpenModal(false);
				clearName()
			}}>
			Guardar
			</Button>
			</ModalFooter>
			</Modal>
		</>
	);
};

export default CommonUpcomingEvents;
