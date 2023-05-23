import React, { FC, useState, useEffect } from 'react';
import classNames from 'classnames';
import {  useFormik } from 'formik';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';

import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../components/bootstrap/Modal';
import Button from '../../../components/bootstrap/Button';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import useDarkMode from '../../../hooks/useDarkMode';
import axios, { AxiosResponse } from 'axios';
import { API_URL } from '../../../constants';
import { useToasts } from 'react-toast-notifications';
import Toasts from '../../../components/bootstrap/Toasts';
import showNotification from '../../../components/extras/showNotification';


interface IUser {
    
	id: number;
	name: string;
	first_name: string;
	last_name: string;
	email: string;
	photo: string;
	type_identification_card: string;
	identification_card: string;
	status: string;
	phone: string;
	company_id: number;
	role_id: number;
	department: string;

}
interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}

type Company = {
	id: number;
	business_name: string;
  }
const mainEmployee: FC<ICommonUpcomingEventsProps> = ({ isFluid }) => {
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
	const { darkModeStatus } = useDarkMode();

	const [users, setUsers] = useState<IUser[]>([]);
	const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const { addToast } = useToasts();
	const [IsOpenModalPhoto,setIsOpenModalPhoto] = useState<boolean>(false);
	
	const [company, setCompany] = useState<Company[]>([]);


	const getUsers = () => {
		axios.get(`${API_URL}employee`)
			.then(response => {
				setUsers(response.data.data);
				console.log("employee",response.data.data);
			})
			.catch(error => {
				console.log(error);
			});
	};
	const getCompany = () => {
		axios.get(`${API_URL}company`)
			.then(response => {
				setCompany(response.data.data);
				console.log(response.data.data);
			})
			.catch(error => {
				console.log(error);
			});
	};
	useEffect(() => {
		getUsers();
		getCompany();	
    }, []);


	const handleDeleteUser = (id: number) => {
		axios.delete(`${API_URL}employee/${id}`)
			.then(response => {
				const updatedUsers = users.filter(user => user.id !== id);
				setUsers(updatedUsers);

			})
			.catch(error => {
				console.log(error);
			});
	};

	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const { items } = useSortableData(users.filter(user => activeFilter === null || user.status === (activeFilter ? 'active' : 'inactive')));
	const [selectedOption, setSelectedOption] = useState('')
	const [selectedGender, setSelectedGender] = useState('')
	const [selectedMaritalStatus, setSelectedMarital] = useState('')


	const handleGenderType = (gender: string) => {
			formik.setFieldValue('gender',gender);
			formik.setFieldValue('gender',gender);
			setSelectedGender(gender);
	};

	const handleIdentificationType = (type_identification_card: string) => {
		formik.setFieldValue('type_identification_card', type_identification_card);
		formik.setFieldValue('type_identification_card', type_identification_card);
		setSelectedOption(type_identification_card);
	};
	const handleMaritalStatus = (marital_status: string) => {
		formik.setFieldValue('marital_status', marital_status);
		formik.setFieldValue('marital_status', marital_status);
		formik.setFieldValue('marital_status', marital_status);
		formik.setFieldValue('marital_status', marital_status);

		setSelectedMarital(marital_status);
	};

	const formik = useFormik({
		onSubmit: () => {},
		initialValues: {
			id_employee: undefined,
			name: '',
			first_name: '',
			last_name: '',
			email: '',
			type_identification_card: '',
			identification_card: '',
			status: undefined,
			phone: '',
			address:'',
			profile_photo_path:'',
			id_company:undefined,
			department:'',
			occupation:'',
			salary:undefined,
			affiliate:undefined,
			gender:'',
			marital_status:'',
			birth_date:'',
		},
		validate: values => {
			const errors: any = {};
			if (!values.name) {
				errors.name = 'Requerido';
			}
			if (!values.first_name) {
				errors.first_name = 'Requerido';
			}
			if (!values.last_name) {
				errors.last_name = 'Requerido';
			}
			if (!values.email) {
				errors.email = 'Requerido';
			}else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)){
				errors.email = 'Correo electrónico inválido';
			}
			if (!values.type_identification_card) {
				errors.type_identification_card = 'Requerido';
			} else if (values.type_identification_card === '0') {
				errors.type_identification_card = 'Selecciona una opción';
			}
			if (!values.identification_card) {
				errors.identification_card = 'Requerido';
			}else if (values.type_identification_card === 'Cedula' && !/^[0-9]{10}$/i.test(values.identification_card)){
				errors.identification_card = 'Cédula inválida';
			}
			else if (values.type_identification_card === 'RUC' && !/^[0-9]{13}$/i.test(values.identification_card)){
				errors.identification_card = 'RUC inválido';
			}
			else if (values.type_identification_card === 'Pasaporte' && !/^[a-zA-Z0-9]{3,20}$/i.test(values.identification_card)){
				errors.identification_card = 'Pasaporte inválido';
			} else if (!/^[0-9]+$/i.test(values.identification_card)) {
				errors.identification_card = 'Solo se permiten números';
			}
			if (!values.phone) {
				errors.phone = 'Requerido';
			}else if (!/^[0-9]{10}$/i.test(values.phone)){
				errors.phone = 'el numero solo debe contener 10 digitos';
			}
			if (!values.address) {
				errors.address = 'Requerido';
			}

			return errors;
		},
	});
	const addUsers = async () => {
		try {
			if (formik.values.id_employee){
				console.log("this is my id",formik.values.id_employee);
				console.log("this is my department",formik.values.department);
				 const response = await axios.put(`${API_URL}employee/${formik.values.id_employee}`, {
					name: formik.values.name,
					first_name: formik.values.first_name,
					last_name: formik.values.last_name,
					email: formik.values.email,
					type_identification_card: formik.values.type_identification_card,
					identification_card: formik.values.identification_card,
					phone: formik.values.phone,
					address: formik.values.address,
					occupation: formik.values.occupation,
					department: formik.values.department,
					gender:	formik.values.gender,
					id_company:formik.values.id_company,
					marital_status:formik.values.marital_status,
				});
				console.log("this my edit",response);
				setUsers([...users, response.data]); 
				setIsOpenModal(false);
				//implementar el toast
				showNotification("Exito",'Usuario actualizado', 'success'); 
			}else {
		  		const response =await axios.post(`${API_URL}employee`,{
					
			name: formik.values.name,
			first_name: formik.values.first_name,
			last_name: formik.values.last_name,
			email: formik.values.email,
			type_identification_card: formik.values.type_identification_card,
			identification_card: formik.values.identification_card,
			password:'12345678',
			phone: formik.values.phone,
			occupation: formik.values.occupation,
			department: formik.values.department,
			gender:	formik.values.gender,
			id_company:formik.values.id_company,
		  });
		  console.log(response);
		 setUsers([...users, response.data]);
		setIsOpenModal(false);  
		//implementar el showNotification
		showNotification("Exito",'Usuario creado', 'success');
	}
}catch (error) {
		  console.error(error);
		  showNotification("Error",'Error al crear el usuario', 'danger');
		}
	  };

	const clearForm = () => {
		formik.resetForm();
		setSelectedOption('');
	};	
	return (
		<>
			<Card stretch={isFluid}>
				<CardHeader borderSize={1}>
					<CardLabel icon='Person' iconColor='info'>
						<CardTitle>Lista de empleados</CardTitle>
					</CardLabel>
					<CardActions>
						<Button
							color='success'
							icon='personAdd'
                            onClick={() => {setIsOpenModal(true)
								clearForm()}}
							>
							Agregar empleados
						</Button>
					</CardActions>
				</CardHeader>
				<CardBody className='table-responsive' isScrollable={isFluid}>
					<table className='table table-modern'>
						<thead>
							<tr>
								<th>Nombre del usuario</th>
								<th>Nombres</th>
								<th>Apellidos</th>
								<th>e-mail</th>
								<th>Tipo de identificación</th>
								<th>Identificación</th>
                                <th>Telefono</th>
                                <th>Direccion</th>
                                <th>Acciones</th>
								<td />
							</tr>
						</thead>
						<tbody>
							{dataPagination(items, currentPage, perPage).map((item) => (
								<tr key={item.id}>
									<td>
										<div>
											<div>{item.name}</div>
										</div>
									</td>
									<td>
										<div className='flex-grow-1 ms-3 d-flex align-items-center text-nowrap'>
											{item.first_name}
										</div>
									</td>
									<td>
										<div className='flex-grow-1 ms-3 d-flex align-items-center text-nowrap'>
											{item.last_name}
										</div>
									</td>
									<td>{item.email}</td>
                                    <td>
									<div className='flex-grow-1 ms-3 d-flex align-items-center text-nowrap'>
										{item.type_identification_card}
									</div>
										</td>
									<td>{item.identification_card}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.address}</td>
									<td>
										<Button
											isOutline={!darkModeStatus}
											color='warning'
											isLight={darkModeStatus}
											className={classNames('text-nowrap', {
												'border-light': !darkModeStatus,
											})}
											icon='Edit'
											onClick={() => {
												setIsOpenModal(true);
												formik.setValues(item);
												formik.setFieldValue('id_employe', item.id);
												formik.setFieldValue('name', item.name);
												formik.setFieldValue('first_name', item.first_name);
												formik.setFieldValue('last_name', item.last_name);
												formik.setFieldValue('email', item.email);
												formik.setFieldValue('photo', item.photo);
												formik.setFieldValue('type_identification_card', item.type_identification_card);
												formik.setFieldValue('identification_card', item.identification_card);
												formik.setFieldValue('status', item.status);
												formik.setFieldValue('phone', item.phone);
												formik.setFieldValue('address', item.address);
												formik.setFieldValue('occupation', item.occupation);
												formik.setFieldValue('department', item.department);
									
												setIsEditMode(false);
												getUsers();
												
											}}>
						
										</Button>
										<Button
											isOutline={!darkModeStatus}
											color='danger'
											isLight={darkModeStatus}
											className={classNames('text-nowrap', {
												'border-light': !darkModeStatus,
											})}
											icon='Cancel'
											onClick={() => {handleDeleteUser(item.id)
												getUsers();
												clearForm();
											}}>
											
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
            <Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal} titleId='tour-title'>
			<ModalHeader setIsOpen={setIsOpenModal}>
				<ModalTitle id='tour-title' className='d-flex align-items-end'>
					<span className='ps-2'>
						<Icon icon='Verified' color='info' />
					</span>
				</ModalTitle>
			</ModalHeader>
			<ModalBody>
			<div className="col-12">
                        <FormGroup
                          id="name"
                          isFloating
                          label="Nombre del usuario"						  		
                        >
                          <Input type="text" 
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  value={formik.values.name}
						  isValid={formik.isValid}
						  isTouched={formik.touched.name}
						  invalidFeedback={formik.errors.name}
						  validFeedback='Perfecto!'
						  />
                        </FormGroup>
            </div>
			<div className="col-12">
                        <FormGroup
                          id="first_name"
                          isFloating
                          label="Nombres"
                        >
                          <Input type="text" 
						  	onChange={formik.handleChange}
							value={formik.values.first_name}
							onBlur={formik.handleBlur}
						  isValid={formik.isValid}
						  isTouched={formik.touched.first_name}
						  invalidFeedback={formik.errors.first_name}
						  validFeedback='Perfecto!'
						  />
                        </FormGroup>
            </div>
			<div className="col-12">
                        <FormGroup
                          id="last_name"
                          isFloating
                          label="Apellidos"
                        >
                          <Input type="text" 
						  	onChange={formik.handleChange}
							value={formik.values.last_name}
						  onBlur={formik.handleBlur}
						  isValid={formik.isValid}
						  isTouched={formik.touched.last_name}
						  invalidFeedback={formik.errors.last_name}
						  validFeedback='Perfecto!'
						  />
                        </FormGroup>
            </div>
			<div className="col-12">
						<FormGroup
							id='email'
							isFloating
							label='Correo electrónico'>
							<Input type='email' 
								value={formik.values.email}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isValid={formik.isValid}
								isTouched={formik.touched.email}
								invalidFeedback={formik.errors.email}
								validFeedback='Perfecto!'
							/>
						</FormGroup>
			</div>
			<div className="col-12">
			<Dropdown>
      <DropdownToggle>
        <Button>
          {selectedOption ? selectedOption : 'Selecciona un tipo de identificación'}
        </Button>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => handleIdentificationType('Cedula')}>Cedula</DropdownItem>
        <DropdownItem onClick={() => handleIdentificationType('Pasaporte')}>Pasaporte</DropdownItem>
        <DropdownItem onClick={() => handleIdentificationType('RUC')}>RUC</DropdownItem>
      </DropdownMenu>
    </Dropdown>
	{
		formik.errors.type_identification_card && formik.touched.type_identification_card
		? <div className="text-danger">{formik.errors.type_identification_card}</div>
		: null
	}
			</div> 
			<div className="col-12">
						<FormGroup
							id='identification_card'
							isFloating
							label='identificación'>
							<Input type='text' 
									
									value={formik.values.identification_card}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.identification_card}
									invalidFeedback={formik.errors.identification_card}
									validFeedback='Perfecto!'

							/>
						</FormGroup>
			</div>
			<div className="col-12">
						<FormGroup
							id='phone'
							isFloating
							label='Telefono'>
							<Input type='text' 
								value={formik.values.phone}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isValid={formik.isValid}
								isTouched={formik.touched.phone}
								invalidFeedback={formik.errors.phone}
								validFeedback='Perfecto!'
							
							/>
						</FormGroup>
			</div>
		
            <div className="col-12">
                        <FormGroup
                        id="Role"
                        label="Rol"
                        isFloating
                        >
                        <Input
                        type='text'
                        value='Empleado'
                        disabled
                        />
                        </FormGroup>
            </div>
			<div className="col-12">
			 <Dropdown>
  <DropdownToggle>

       <Button>
    {formik.values.id_company ? 
      company.find(companys => companys.id === formik.values.id_company)?.business_name || "Selecciona una Compañia"
      : "Selecciona una Compañia"
    }
  </Button>

  </DropdownToggle>
  <DropdownMenu>
    {company && company.map((companys) => (
      <DropdownItem 
        key={companys.id} 
        onClick={() => {
          formik.setFieldValue("id_company", companys.id);
        }}
      >
        {companys.business_name}
      </DropdownItem>
    ))}
  </DropdownMenu>
</Dropdown>
			</div>
			<div className="col-12">
						<FormGroup
							id='department'
							isFloating
							label='Departamento'>
							<Input 
								type='text' 
								value={formik.values.department}
								onChange={formik.handleChange}
							/>
						</FormGroup>
			</div>
			<div className="col-12">
						<FormGroup
							id='occupation'
							isFloating
							label='Ocupación'>
							<Input type='text'
								value={formik.values.occupation}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isValid={formik.isValid}
								isTouched={formik.touched.occupation}
								invalidFeedback={formik.errors.occupation}
								validFeedback='Perfecto!'
							/>
						</FormGroup>
			</div>
			<div className="col-12">
			<Dropdown>
      <DropdownToggle>
        <Button>
          {selectedGender ? selectedGender : 'Selecciona el genero'}
        </Button>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => handleGenderType('M')}>Masculino</DropdownItem>
        <DropdownItem onClick={() => handleGenderType('F')}>Femenino</DropdownItem>
      </DropdownMenu>
    </Dropdown>
	</div>
	<div className="col-12">
			<Dropdown>
      <DropdownToggle>
        <Button>
          {selectedMaritalStatus ? selectedMaritalStatus : 'Selecciona el estado marital'}
	
        </Button>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => handleMaritalStatus('Casado/a')}>Casado/a</DropdownItem>
        <DropdownItem onClick={() => handleMaritalStatus('Soltero/a')}>Soltero/a</DropdownItem>
	    <DropdownItem onClick={() => handleMaritalStatus('Divorciado/a')}>Divorciado/a</DropdownItem>
		<DropdownItem onClick={() => handleMaritalStatus('Viudo/a')}>Viudo/a</DropdownItem>
      </DropdownMenu>
    </Dropdown>
	</div>
			</ModalBody>
			<ModalFooter>
				<Button icon='Close' color='danger' isLink onClick={() => {setIsOpenModal(false)
				formik.resetForm()
				getUsers();
			}}>
					Cancelar
				</Button>
				<Button
					icon='DoneOutline'
					color='success'
					isLight
					onClick={() => {
						setIsOpenModal(false);
						addUsers();
						getUsers();
					}}>
					Guardar
				</Button>
			</ModalFooter>
		</Modal>
		</>
	);
};

export default mainEmployee;