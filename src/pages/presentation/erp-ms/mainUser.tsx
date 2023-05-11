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
import Avatar from '../../../components/Avatar';
import Input from '../../../components/bootstrap/forms/Input';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import useDarkMode from '../../../hooks/useDarkMode';
import axios, { AxiosResponse } from 'axios';
import { API_URL } from '../../../constants';




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
		axios.delete(`/api/user/${id}`)
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
	
	const handleIdentificationType = (type_identification_card: string) => {
		formik.setFieldValue('type_identification_card', type_identification_card);
		formik.setFieldValue('type_identification_card', type_identification_card);
	};
	const formik = useFormik({
		onSubmit<Values>(
			values: Values,
			formikHelpers: FormikHelpers<Values>,
			): void | Promise<any> {
			return undefined;
			},
		initialValues: {
			id: undefined,
			name: '',
			first_name: '',
			last_name: '',
			email: '',
			photo: '',
			type_identification_card: '',
			identification_card: '',
			status: '',
			password:'12345678',
			phone: '',
			address:'',
			role_id:undefined,
		},
	});
	const addUsers = async () => {
		try {
			if (isEditMode && formik.values.id) {
			  const response = await axios.put(`${API_URL}roles/${formik.values.id}`, {
				id: formik.values.id,
				name: formik.values.name,
				first_name: formik.values.first_name,
				last_name: formik.values.last_name,
				email: formik.values.email,
				photo: formik.values.photo,
				type_identification_card: formik.values.type_identification_card,
				identification_card: formik.values.identification_card,
				status: formik.values.status,
				password: formik.values.password,
				phone: formik.values.phone,
				address: formik.values.address,
				role_id: formik.values.role_id,
			  });
			  console.log(response);
			  setUsers([...users, response.data]);
			  setIsOpenModal(false);
			}else {
		  		const response = await axios.post(`${API_URL}user`, {
				name: formik.values.name,
			first_name: formik.values.first_name,
			last_name: formik.values.last_name,
			email: formik.values.email,
			photo: formik.values.photo,
			type_identification_card: formik.values.type_identification_card,
			identification_card: formik.values.identification_card,
			status: formik.values.status,
			password: formik.values.password,
			phone: formik.values.phone,
			address: formik.values.address,
			role_id: formik.values.role_id,
		  });
		  console.log(response);
		  setUsers([...users, response.data]);
		  setIsOpenModal(false);
	}
}catch (error) {
		  console.error(error);
		}
	  };

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
                            onClick={() => setIsOpenModal(true)}>
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
										<div className='d-flex'>
											<div className='flex-shrink-0'>
												<Avatar
													src={item.photo}
													size={36}
												/>
											</div>
										</div>
									</td>
                                    <td>{item.type_identification_card}</td>
									<td>{item.identification_card}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.address}</td>
                                    <td>{item.role_id.name}</td> 
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
											color='dark'
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
											}}>
											Editar
										</Button>
										<Button
											isOutline={!darkModeStatus}
											color='dark'
											isLight={darkModeStatus}
											className={classNames('text-nowrap', {
												'border-light': !darkModeStatus,
											})}
											icon='Cancel'
											onClick={() => handleDeleteUser(item.id)}>
											Eliminar
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
						   value={formik.values.name}
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
							/>
						</FormGroup>
			</div>
			<div className="col-12">
						<FormGroup
							id='password'
							isFloating
							label='Contraseña'>
							<Input type='password' 
								value={formik.values.password}
								onChange={formik.handleChange}
								disabled={true}
							/>
						</FormGroup>
			</div>
			<div className="col-12">
			 <Dropdown>
  <DropdownToggle>
    <Button>Selecciona un tipo de identificación</Button>
  </DropdownToggle>
  <DropdownMenu>
    <DropdownItem onClick={() => handleIdentificationType('Cedula')}>Cedula</DropdownItem>
    <DropdownItem onClick={() => handleIdentificationType('Pasaporte')}>Pasaporte</DropdownItem>
    <DropdownItem onClick={() => handleIdentificationType('RUC')}>RUC</DropdownItem>
  </DropdownMenu>
</Dropdown>
			</div> 
			<div className="col-12">
						<FormGroup
							id='identification_card'
							isFloating
							label='identificación'>
							<Input type='text' 
									
									value={formik.values.identification_card}
									onChange={formik.handleChange}
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
							/>
						</FormGroup>
			</div>
		 	<div className="col-12">
			 <Dropdown>
  <DropdownToggle>
    <Button>
      {formik.values.role_id ? 
        roles.find(role => role.id === formik.values.role_id)?.name || "Selecciona un Rol"
        : "Selecciona un Rol"
      }
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
			</div> 
			</ModalBody>
			<ModalFooter>
				<Button icon='Close' color='danger' isLink onClick={() => setIsOpenModal(false)}>
					Cancelar
				</Button>
				<Button
					icon='DoneOutline'
					color='success'

					isLight
					onClick={() => {
						setIsOpenModal(false);
						addUsers();

					}}>
					Guardar
				</Button>
			</ModalFooter>
		</Modal>
		</>
	);
};

export default MainUser;