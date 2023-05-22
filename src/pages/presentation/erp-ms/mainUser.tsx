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
}
interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}

type Role = {
	id: number;
	name: string;
  }
const MainUser: FC<ICommonUpcomingEventsProps> = ({ isFluid }) => {
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
	const [roles, setRoles] = useState<Role[]>([]);
	const [isEditMode, setIsEditMode] = useState(false);
	const { addToast } = useToasts();
	const [IsOpenModalPhoto,setIsOpenModalPhoto] = useState<boolean>(false);
	const [selectedId, setSelectedId] = useState(null);


	const getUsers = () => {
		axios.get(`${API_URL}user`)
			.then(response => {
				setUsers(response.data.data);
				console.log(response.data.data);
			})
			.catch(error => {
				console.log(error);
			});
	};
	const getRoles = () => {
		axios.get(`${API_URL}roles`)
			.then(response => {
				setRoles(response.data.data);
				console.log(response.data.data);

			})
			.catch(error => {
				console.log(error);
			});
	};
	
	
	useEffect(() => {
		getUsers();
		getRoles();
	}, []);


	const handleDeleteUser = (id: number) => {
		axios.delete(`${API_URL}user/${id}`)
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


	const handleIdentificationType = (type_identification_card: string) => {
		formik.setFieldValue('type_identification_card', type_identification_card);
		formik.setFieldValue('type_identification_card', type_identification_card);
		setSelectedOption(type_identification_card);
	};	const formik = useFormik({
		onSubmit: () => {},
		initialValues: {
			id: undefined,
			name: '',
			first_name: '',
			last_name: '',
			email: '',
			type_identification_card: '',
			identification_card: '',
			status: undefined,
			phone: '',
			address:'',
			role_id:undefined,
			profile_photo_path:'',
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
			if (!values.role_id) {
				errors.role_id = 'Requerido';
			} else if (values.role_id === '0') {
				errors.role_id = 'Selecciona una opción';
			}
			return errors;
		},
	});
	const addUsers = async () => {
		try {
			if (formik.values.id){
				console.log("this is my id",formik.values.id);
				const response = await axios.put(`${API_URL}user/${formik.values.id}`, {
					name: formik.values.name,
					first_name: formik.values.first_name,
					last_name: formik.values.last_name,
					email: formik.values.email,
					type_identification_card: formik.values.type_identification_card,
					identification_card: formik.values.identification_card,
					status: formik.values.status,
					phone: formik.values.phone,
					address: formik.values.address,
					role_id: formik.values.role_id,
				});
				console.log(response);
				setUsers([...users, response.data]);
				setIsOpenModal(false);
				//implementar el toast
				addToast(
					<Toasts
						title='Usuario actualizado'
						icon='success'
						iconColor='success'
						time='Justo ahora'>
						Usuario actualizado con exito
					</Toasts>,
					{
						autoDismiss: true,
					},
				)
			}else {
		  		const response = await axios.post(`${API_URL}user`, {
				name: formik.values.name,
			first_name: formik.values.first_name,
			last_name: formik.values.last_name,
			email: formik.values.email,
			type_identification_card: formik.values.type_identification_card,
			identification_card: formik.values.identification_card,
			status: formik.values.status,
			password:'12345678',
			phone: formik.values.phone,
			address: formik.values.address,
			role_id: formik.values.role_id,
		  });
		  console.log(response);
		  setUsers([...users, response.data]);
		  setIsOpenModal(false);
		//implementar el toast
		addToast(
			<Toasts
				title='Usuario creado'
				icon='success'
				iconColor='success'
				time='Justo ahora'
				
				>
				Usuario creado con exito
			</Toasts>,
			{
				autoDismiss: true,
			},
		)
	}
}catch (error) {
		  console.error(error);
		}
	  };
	const activateUser = (id: undefined) => {
		axios.put(`${API_URL}user/Status/${id}`)
			.then(response => {
				const updatedUsers = users.map(user => {
					if (user.id === id) {
						user.status = 'true';
					}

					return user;
				});
				setUsers(updatedUsers);
				addToast(
					<Toasts
						title='Usuario activado'
						icon='success'
						iconColor='success'
						time='Justo ahora'>
						Usuario activado con exito
					</Toasts>,
					{
						autoDismiss: true,
					},
				)
			})
			.catch(error => {
				console.log(error);
			//implementar el toast
			addToast(
				<Toasts
					title='Error'
					icon='Error'
					iconColor='danger'
					time='Justo ahora'>
					No se pudo activar el usuario
				</Toasts>,
				{
					autoDismiss: true,
				},
			)
			});
	};
	const clearForm = () => {
		formik.resetForm();
		setSelectedOption('');
	};	
	const onFileChange = (event: any) => {
	const profile_photo_path=formik.setFieldValue('profile_photo_path', event.target.files[0]);
		console.log("llego al onchange",profile_photo_path);
	};

	const onUploadFile = async () => {
		const id = selectedId;
		
		const formData = new FormData();
		formData.append('profile_photo_path', formik.values.profile_photo_path);
		await axios.post(`${API_URL}user/Photo/${id}`, formData,{
		headers:{
			'Content-Type': 'multipart/form-data'
		  }
		});
		setIsOpenModal(false);
		addToast(
			<Toasts
				title='Foto de perfil actualizada'
				icon='success'
				iconColor='success'
				time='Justo ahora'>
				Foto de perfil actualizada con exito
			</Toasts>,
			{
				autoDismiss: true,
			},
		)
		
	}
	return (
		<>
			<Card stretch={isFluid}>
				<CardHeader borderSize={1}>
					<CardLabel icon='Person' iconColor='info'>
						<CardTitle>Lista de Usuarios</CardTitle>
					</CardLabel>
					<CardActions>
						<Button
							color='success'
							icon='personAdd'
                            onClick={() => {setIsOpenModal(true)
								clearForm()}}
							>
							Agregar usuarios
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
								<th>Foto</th>
								<th>Tipo de identificación</th>
								<th>Identificación</th>
                                <th>Telefono</th>
                                <th>Direccion</th>
                                <th>Rol</th>
								<th>Estado</th>
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
											<div className='flex-shrink-0'>
												{/* capture id for open modalPhoto upload photo */}
												<Button
													color='primary'
													icon='camera'
													onClick={() => {
														setSelectedId(item.id);
														setIsOpenModalPhoto(true);
													  }}
													>
													
												</Button>	
											</div>
										</div>
									</td>
                                    <td>
									<div className='flex-grow-1 ms-3 d-flex align-items-center text-nowrap'>
										{item.type_identification_card}
									</div>
										</td>
									<td>{item.identification_card}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.address}</td>
                                    <td>{item.role_id ? item.role_id.name : "Sin ningún rol"}</td>
									<td>
  {item.status === true ? (
    <Button isLink color="success" icon="Circle" className="text-nowrap">
      Activo
    </Button>
  ) : (
    <Button isLink color="danger" icon="Circle" className="text-nowrap">
      Inactivo
    </Button>
  )}
</td>
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
												formik.setFieldValue('userId', item.id);
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
												formik.setFieldValue('role_id', item.role_id);
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
							id='address'
							isFloating
							label='Dirección'>
							<Input type='text' 
								value={formik.values.address}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isValid={formik.isValid}
								isTouched={formik.touched.address}
								invalidFeedback={formik.errors.address}
								validFeedback='Perfecto!'
							/>
						</FormGroup>
			</div>
		 	<div className="col-12">
			 <Dropdown>
  <DropdownToggle>
    <Button>
       <Button>
    {formik.values.role_id ? 
      roles.find(role => role.id === formik.values.role_id)?.name || "Selecciona un Rol"
      : "Selecciona un Rol"
    }
  </Button>
    </Button>
  </DropdownToggle>
  <DropdownMenu>
    {roles && roles.map((role) => (
      <DropdownItem 
        key={role.id} 
        onClick={() => {
          formik.setFieldValue("role_id", role.id);
        }}
      >
        {role.name}
      </DropdownItem>
    ))}
  </DropdownMenu>
</Dropdown>
{
		formik.errors.role_id && formik.touched.role_id
		? <div className="text-danger">{formik.errors.role_id}</div>
		: null
	}

			</div>
			<div className="col-12">
{formik.values.status ===false && (
    <Button
      color='success'
      className='mt-3'
      onClick={() => {
        activateUser(formik.values.id);
      }}
    >
      Activar
    </Button>
	  )}
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
					isDisable={Object.keys(formik.errors).length > 0}
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


<Modal isOpen={IsOpenModalPhoto} setIsOpen={setIsOpenModalPhoto} titleId='tour-title'>
  <ModalHeader setIsOpen={setIsOpenModalPhoto}>
    <ModalTitle id='tour-title' className='d-flex align-items-end'>
      <span className='ps-2'>
        <Icon icon='Verified' color='info' />
      </span>
    </ModalTitle>
  </ModalHeader>
  <ModalBody>
    <input
      type="file"
      accept="image/*"
	  onChange={onFileChange}		
    />
  </ModalBody>
  <ModalFooter>
    <Button icon='Close' color='danger' isLink onClick={() => setIsOpenModalPhoto(false)}>
      Cancelar
    </Button>
    <Button
      icon='DoneOutline'
      color='success'
      isLight
      onClick={() => {
		onUploadFile();
      }}
    >
      Guardar
    </Button>
  </ModalFooter>
</Modal> 
		</>
	);
};

export default MainUser;