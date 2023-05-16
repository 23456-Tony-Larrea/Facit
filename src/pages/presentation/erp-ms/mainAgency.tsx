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
import Select from '../../../components/bootstrap/forms/Select';

interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}
interface IAgency{
  roleId: number;
  name: string;
  
}

interface ICustomerEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
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
  const [agency, setAgency] = useState<IAgency[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  	const ADD_TITLE = 'Nueva Agencia';
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
	// const getAgency = async () => {
	// 	await axios
	// 	  .get(`${API_URL}roles`)
	// 	  .then(response => {
	// 		setAgency(response.data.data);
	// 		console.log(response.data.data);
	// 	  })
	// 	  .catch(error => {
	// 		console.log(error);
	// 	  });
	//   };
	// const getPermisos = async () => {
	// 	await axios
	// 	.get(`${API_URL}permissions`)
	// 	.then(response => {
	// 		/* setPermisos(response.data.data); */
	// 		console.log(response.data.data);
	// 	})
	// 	.catch(error => {
	// 		console.log(error);
	// 	});
	// };

	// useEffect(() => {
	// 	getRoles();
	// 	getPermisos();
	// 	}, []);		
	// 	const addRoles = async () => {
	// 		try {
	// 		  if (isEditMode) {
	// 			if (!formik.values.roleId) {
	// 			  console.log("roleId is not defined"); // Mostrar mensaje de error si roleId no está definido
	// 			  return;
	// 			}
	// 			await axios.put(`${API_URL}roles/${formik.values.roleId}`, { name: formik.values.roleName });
	// 		  } else {
	// 			await axios.post(`${API_URL}roles`, { name: formik.values.roleName });
	// 		  }
	// 		  getRoles();
	// 		  setIsOpenModal(false);
	// 		} catch (error) {
	// 		  console.log(error);
	// 		}
	// 	  };


	
	//   const deleteRole = async (roleId: number | undefined) => {
	// 	try {
	// 	  if (roleId) {
	// 		await axios.delete(`${API_URL}roles/${roleId}`);
	// 		getRoles();
	// 	  }
	// 	} catch (error) {
	// 	  console.log(error);
	// 	}
	//   };
	
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
				<CardHeader borderSize={5}>
					<CardLabel icon='storefront' iconColor='info'>
						 <CardTitle tag='h4' className='font-weight-bold'>
          Agencias
        </CardTitle>
				
						
					</CardLabel>
					<CardActions>
						
						<Button
						color='success'
					icon='add'
				
					onClick={() => {setIsOpenModal(true)
						setModalTitle(ADD_TITLE);
						setIsEditMode(false);
					}
				}
				//commit
					>
					Nuevo
					</Button>
						
					</CardActions>
				</CardHeader>
				<CardBody style={{ width: '100%', overflowX: 'auto' }}>
				<table className='table table-modern '>
  <thead>
    <tr>
      <th className='col-sm-2' onClick={() => requestSort('provincia')}>
        <h4>Provincia</h4>
      </th>
      <th className='col-sm-2' onClick={() => requestSort('canton')}>
        <h4>Cantón</h4>
      </th>
      <th className='col-sm-2' onClick={() => requestSort('empresa')}>
        <h4>Empresa</h4>
      </th>
      <th className='col-sm-2' onClick={() => requestSort('nombre')}>
        <h4>Nombre</h4>
      </th>
      <th className='col-sm-2' onClick={() => requestSort('cEstablecimiento')}>
        <h4>C. Establecimiento</h4>
      </th>
      <th className='col-sm-2' onClick={() => requestSort('cEmision')}>
        <h4>C. Emisión</h4>
      </th>
      <th className='col-sm-2' onClick={() => requestSort('estado')}>
        <h4>Estado</h4>
      </th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {items.map((item) => (
      <tr key={item.id}>
        <td>{item.provincia}</td>
        <td>{item.canton}</td>
        <td>{item.empresa}</td>
        <td>{item.nombre}</td>
        <td>{item.cEstablecimiento}</td>
        <td>{item.cEmision}</td>
        <td>{item.estado}</td>
        <td></td>
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
			<CardHeader>
									<CardLabel icon='ReceiptLong'>
										<CardTitle>Elegir</CardTitle>
									</CardLabel>
								</CardHeader>
								<Select
									id='province'
									size='lg'
									ariaLabel='Category'
									placeholder='Provincia'
									// list={Object.keys(CATEGORIES).map((c) => CATEGORIES[c])}
									className={classNames('rounded-1', {
										'bg-white': !darkModeStatus,
									})}
									// onChange={(e: { target: { value: any } }) => {
									// 	formik.handleChange(e);

									// 	if (e.target.value)
									// 		debounce(
									// 			() =>
									// 				onFormSubmit({
									// 					...formik.values,
									// 					category: e.target.value,
									// 				}),
									// 			1000,
									// 		)();
									// }}
									// value={formik.values.category}
								/>
								<Select
									id='canton'
									size='lg'
									ariaLabel='Category'
									placeholder='Cantón'
									// list={Object.keys(CATEGORIES).map((c) => CATEGORIES[c])}
									className={classNames('rounded-1', {
										'bg-white': !darkModeStatus,
									})}
									
								/>
								<Select
									id='users'
									size='lg'
									ariaLabel='Category'
									placeholder='Usuarios'
									// list={Object.keys(CATEGORIES).map((c) => CATEGORIES[c])}
									className={classNames('rounded-1', {
										'bg-white': !darkModeStatus,
									})}
									
								/>

			<FormGroup id='name' label='Nombre Comercial' className='col-md-10'>
							<Input onChange={formik.handleChange}
							//  value={formik.values.name}
							 />
						</FormGroup>
						<FormGroup id='name' label='Codigo Establecimiento' className='col-md-10'>
							<Input 
							onChange={formik.handleChange}
							//  value={formik.values.name}
							 />
						</FormGroup>

						<FormGroup id='name' label='Codigo Emision' className='col-md-10'>
							<Input onChange={formik.handleChange}
							//  value={formik.values.name}
							 />
						</FormGroup>
						<FormGroup id='name' label='Telefono' className='col-md-10'>
							<Input onChange={formik.handleChange}
							//  value={formik.values.name}
							 />
						</FormGroup>
						<FormGroup id='name' label='Whatsapp' className='col-md-10'>
							<Input onChange={formik.handleChange}
							//  value={formik.values.name}
							 />
						</FormGroup>
						<FormGroup id='name' label='Direccion' className='col-md-10'>
							<Input onChange={formik.handleChange}
							//  value={formik.values.name}
							 />
						</FormGroup>
						<FormGroup id='name' label='Quienes Somos?' className='col-md-10'>
							<Input onChange={formik.handleChange}
							//  value={formik.values.name}
							 />
						</FormGroup>
						
								
							
			</div>
			</div>
			</div>
			</ModalBody>
			<ModalFooter>
			
			<Button
			icon='Save'
			color='success'
			isLight
			onClick={() => {
				
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
