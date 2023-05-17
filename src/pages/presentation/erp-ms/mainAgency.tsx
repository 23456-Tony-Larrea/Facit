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
	id: string;
	address: string;
	description: string;
	id_company: string;
	iva_holiday: string;
	phone: string;
	establishment_code: string;
	emission_code: string;
	matriz: string;
	state: string;
	tradename: string;
	whatsapp: string;
	id_canton: string;
	id_province: string;
	logo_path: string;
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
	const EDIT_TITLE = 'Editar Agencia';
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
			id:undefined,
			address: '',
			description: '',
			id_company: '',
			iva_holiday:undefined,
			phone: '',
			establishment_code: '',
			emission_code: '',
			matriz:undefined,
			state:undefined,
			tradename: '',
			whatsapp: '',
			id_canton:undefined,
			id_province:undefined,
			logo_path: '',
		},
	});
	const getAgency = async () => {
		try {
			const response = await axios.get(`${API_URL}agency`);
			setAgency(response.data.data);
			console.log(response.data.data);
		  } catch (error) {
			console.log(error);
		  }
		};


	useEffect(() => {
		getAgency();
		}, []);		
	
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
				<CardHeader borderSize={4}>
					<CardLabel icon='storefront' iconColor='info'>
						 <CardTitle tag='h3' className='font-weight-bold'>
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
				<CardBody style={{ width: '109%', overflowX: 'auto' }}>
				<table className='table table-modern '>
  <thead>
    <tr>
      <th className='col-sm-2'>
        Dirección
      </th>
      <th className='col-sm-2' >
        Descripción
      </th>
      <th className='col-sm-2' >
        Empresa
      </th>
      <th className='col-sm-2'>
        Codigo de emisión
      </th>
      <th className='col-sm-2' >
        Codigo de establecimiento
      </th>
      <th className='col-sm-2'>
	  	IVA feriado
      </th>
      <th className='col-sm-2'>
        Telefono fijo
      </th>
      <th className='col-sm-2'>
		Logo
		</th>
		<th className='col-sm-2'>
		matriz
		</th>
		<th className='col-sm-2'>
		Estado
		</th>
		<th className='col-sm-2'>
			Nombre comercial
		</th>
		<th className='col-sm-2'>
		Whatsapp
		</th>
		<th className='col-sm-2'>
		Falta
		</th>
		<th className='col-sm-2'>
		Acciones
		</th>
    </tr>
  </thead>
  <tbody>
  {dataPagination(agency, currentPage, perPage).map((item) => (
								<tr key={item.id}>
									<td className='col-sm-2'>
										{item.address}
									</td>
									<td className='col-sm-2'>
										{item.description}
									</td>
									<td className='col-sm-2'>
										{item.emission_code}
									</td>
									<td className='col-sm-2'>
										{item.establishment_code}
									</td>
									<td className='col-sm-2'>
										{item.iva_holiday}
									</td>
									<td className='col-sm-2'>
										{item.landline}
									</td>
									<td className='col-sm-2'>
									{item.logo_path}
									</td>
									<td className='col-sm-2'>
									{item.matriz}
									</td>
									<td className='col-sm-2'>
									{item.state}
									</td>
									<td className='col-sm-2'>
									{item.tradename}
									</td>
									<td className='col-sm-2'>
									{item.whatsapp}
									</td>
									<td className='col-sm-2'>
									hola
									</td>
									<td className='col-sm-2'>
									hola
									</td>
									
									<td className='col-sm-2'>
									<Button
									color='success'
									icon='edit'
									>
									</Button>
									<Button
									color='danger'
									icon='delete'
									>
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
			<Card>
			<CardHeader>
				<CardLabel icon='ReceiptLong'>
				<CardTitle>Asignar</CardTitle>
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
								 </Card>
								 </div>
    							</div>
								 <div className="row">
     							 <div className="col-md-10">
        						<Card>
         					 <CardBody>
						<FormGroup id='name' label='Nombre Comercial' className='col-md-10'>
							<Input onChange={formik.handleChange}

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
						</CardBody>
        </Card>
								
							
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