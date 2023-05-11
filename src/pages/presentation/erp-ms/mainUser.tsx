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
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import useDarkMode from '../../../hooks/useDarkMode';
import axios from 'axios';
import { API_URL } from '../../../constants';




interface IUser {
    
	id: number;
	name: string;
	first_name: string;
	last_name: string;
	email: string;
	photo: string;
	identification_card: string;
	identificationNumber: string;
	status: string;
}
interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
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

	useEffect(() => {
		axios.get(`${API_URL}user`)
			.then(response => {
				setUsers(response.data.data);
                console.log(response.data.data[0].status);

			})
			.catch(error => {
				console.log(error);
			});
	}, []);

	const handleAddUser = (values: IUser, { resetForm }: FormikHelpers<IUser>) => {
		axios.post(`${API_URL}user`, values)
			.then(response => {
				setUsers([...users, response.data]);
				resetForm();
			})
			.catch(error => {
				console.log(error);
			});
	};

	const handleEditUser = (values: IUser, { resetForm }: FormikHelpers<IUser>) => {
		axios.put(`/api/user/${values.id}`, values)
			.then(response => {
				const updatedUsers = users.map(user => user.id === response.data.id ? response.data : user);
				setUsers(updatedUsers);
				resetForm();
			})
			.catch(error => {
				console.log(error);
			});
	};

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
    const formik = useFormik<IUser>({
        initialValues: {
            id: 0,
            name: '',
            first_name: '',
            last_name: '',
            email: '',
            photo: '',
            identification_card: '',
            identificationNumber: '',
            status: '',
        },
        onSubmit: handleAddUser,
    });
    
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
											onClick={() => {}}>
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
				<div className='row'>
					
					<div className='col-md-9 d-flex align-items-center'>
						<div>
							<h2>Hi 👋🏻, I'm Susy.</h2>
							<p className='lead'>
								Would you like me to introduce "Facit" to you in a few steps?
							</p>
						</div>
					</div>
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
					}}>
					
				</Button>
			</ModalFooter>
		</Modal>
		</>
	);
};

export default MainUser;