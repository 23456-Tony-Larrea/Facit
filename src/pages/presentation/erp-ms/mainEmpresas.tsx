import React, { FC, useState, useEffect,ChangeEvent  } from 'react';
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
import showNotification from '../../../components/extras/showNotification';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Avatar from '../../../components/Avatar';

interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}
interface IEmpresa {
	id: number;
	name: string;
}
interface IProvince{
	id:undefined;
	name:undefined;
}
interface ICanton{
	id:undefined;
	name:undefined;
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
	

	const handleDeletePhoto = () => {
		setSelectedPhoto(null);
	  };
	
	const { themeStatus, darkModeStatus } = useDarkMode();
	const [empresa, setEmpresa] = useState<IEmpresa[]>([]);
	const [isEditMode, setIsEditMode] = useState(false);
	const ADD_TITLE = 'Nueva Empresa';
	const EDIT_TITLE = 'Editar Empresa';
	const [modalTitle, setModalTitle] = useState('');
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
	const [province, setProvince] = useState<IProvince[]>([]);
  const [canton, setCanton] = useState<ICanton[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectId, setSelectId] =useState(null);
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
			if (!values.business_name) {
				errors.business_name = 'Requerido';
			}
			if (!values.email_company) {
				errors.email_company = 'Requerido';
			}else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email_company)){
				errors.email_company = 'Correo electrónico inválido';
			}
			if (!values.commercial_name) {
				errors.commercial_name = 'Requerido';
			}
			if (!values.web_site) {
			 	errors.web_site = 'Requerido';
			} 
			if (!values.ruc) {
				errors.ruc = 'Requerido';
			} else if (!/^[0-9]{13}$/i.test(values.ruc)) {
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
				showNotification('Exito', 'Empresa eliminada correctamente',"warning");
			})
			.catch((error) => {
				console.log(error);
				showNotification('Error', 'No se pudo eliminar la empresa',"danger");
			});
	};
	const getProvince = () => {
		axios.get(`${API_URL}province`)
		.then(response => {
		setProvince(response.data);
		})
		.catch(error => {
		console.log(error);
		});
		};
		const getCanton = (id_canton: undefined) => {
			console.log(id_canton);
			axios
			  .get(`${API_URL}canton/${id_canton}`)
			  .then(response => {
				setCanton(response.data);
			  })
			  .catch(error => {
				console.log(error);
			  });
		  };
	useEffect(() => {
		getEmpresas();
		getProvince();
	}, []);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const { items, requestSort, getClassNamesFor } = useSortableData(data);


	const clearId = () => {
		setSelectId(null);
		formik.setFieldValue('id', null);
	};
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
				showNotification('Exito', 'Empresa actualizada correctamente',"success");
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
			showNotification('Exito', 'Empresa creada correctamente',"success");
		} catch (error) {
			console.log(error);
			showNotification('Error', 'No se pudo crear la empresa',"danger");
		}
	};
	const clearForm = () => {
		formik.resetForm();
	};
	const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
		const logo_path = formik.setFieldValue('logo_path',event.target.files?.[0]);
		console.log(logo_path);
	  };
	const onUploadFile= async () => {
		const id = selectId
		const formData = new FormData();
		formData.append('logo_path', formik.values.logo_path);
		await axios.post(`${API_URL}company/Logo/${id}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				},
				})
				.then(response => {
					console.log(response);
				})
				.catch(error => {
					console.log(error);
				});
		showNotification('Exito', 'Logo de compañia cargado correctamente', 'success');
		}
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
								clearId();
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
								<th>Acciones</th>
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
												setSelectId(item.id);
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

			
			<Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal}>
				<ModalHeader setIsOpen={setIsOpenModal}>
					<ModalTitle id='tour-title' className='d-flex align-items-end'>
						<span className='ps-2'>
							<h3 className='text-center'>{modalTitle}</h3>
						</span>
					</ModalTitle>
				</ModalHeader>
				<ModalBody className='row'>
				
					<Card>
						<CardHeader>
							<CardLabel icon='Apartment'>
								<CardTitle>Empresa</CardTitle>
							</CardLabel>
						</CardHeader>
						<CardBody className='pt-0'>
						<Dropdown>
    		<DropdownToggle>
      <Button>
        {formik.values.id_province ?
          province.find(province => province.id === formik.values.id_province)?.name || "Selecciona una Provincia"
          : "Selecciona una Provincia"
        }
      </Button>
    </DropdownToggle>
    <DropdownMenu  style={{ maxHeight: '175px', overflowY: 'auto' }}>
      {province && province.slice(0, 1000).map((provinces) => (
        <DropdownItem
          key={provinces.id}
          onClick={() => {
            formik.setFieldValue("id_province", provinces.id);
            getCanton(provinces.id);
          }}
		  
        >
          {provinces.name}
        </DropdownItem>
      ))}
    </DropdownMenu>
  </Dropdown>
  {formik.errors.id_province && (
	<h1 className="invalid-feedback d-block">
	{formik.errors.id_province}
	</h1>
  )}

  <Dropdown>
    <DropdownToggle>
      <Button>
        {formik.values.id_canton ?
          canton.find(canton => canton.id === formik.values.id_canton)?.name || "Selecciona Canton "
          : "Selecciona Canton"
        }
      </Button>
    </DropdownToggle>

    <DropdownMenu style={{ maxHeight: '150px', overflowY: 'auto' }}>
      {canton && canton.slice(0, 1000).map((cantons) => (
        <DropdownItem
          key={cantons.id}
          onClick={() => {
            formik.setFieldValue("id_canton", cantons.id);
          }}
        >
          {cantons.name}
        </DropdownItem>
      ))}
    </DropdownMenu>
  </Dropdown>
  {formik.errors.id_canton&& (
	<h1 className="invalid-feedback d-block">
	{formik.errors.id_canton}
	</h1>
  )}
						</CardBody>
					</Card>
					<Card className='d-flex justify-content-center align-item-center w-100'>
						<CardBody>
						{selectId && (
			<Card>
			<CardHeader>
			
			<CardLabel icon='AddAPhoto'>
				<CardTitle>Asignar</CardTitle>
				</CardLabel>
				</CardHeader>



			<CardBody className='pt-5'>
			<div className='row g-5'>
			<div className='col-12 d-flex justify-content-center'>
            {selectedPhoto ? (
              <Avatar src={selectedPhoto} />
            ) : (
              <div>No hay foto seleccionada</div>
            )}
          </div>
          <div className='col-xl'>
            <div className='row g-3'>
              <div className='col-auto '>
                <Input type='file' autoComplete='photo' onChange={handlePhotoChange} />
              </div>
              <div className='col-auto '>
			  <Button color='dark' isLight icon='Delete' onClick={handleDeletePhoto}>

                  Eliminar Foto
                </Button>
              </div>
              <div className='col-12'></div>
            </div>
          </div>
        </div>
      </CardBody>
	 </Card>
	 )}

							<FormGroup id='ruc' isFloating label='RUC' className='col-md-12'>
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
								className='col-md-12'>
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
								className='col-md-12'>
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
								className='col-md-12'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.email_company}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.email_company}
									invalidFeedback={formik.errors.email_company}
									validFeedback='Perfecto!'
								/>
							</FormGroup>
							<FormGroup
								id='address'
								label='Direccion'
								isFloating
								className='col-md-12'>
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
							<FormGroup id='phone' label='Telefono' isFloating className='col-md-12'>
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
							<FormGroup id='web_site' label='Sitio Web' isFloating className='col-md-12'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.web_site}
									invalidFeedback={formik.errors.web_site}
									isTouched={formik.touched.web_site}
									validFeedback='Perfecto!'
									isValid={formik.isValid}
									onBlur={formik.handleBlur}

								/>
							</FormGroup>
							
						</CardBody>
					</Card>
					{/* </div> */}
					{/* </div> */}
					{/* </div> */}
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
							onUploadFile();
						}}
						isDisable={Object.keys(formik.errors).length > 0}
						>
						Guardar
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
};

export default CommonUpcomingEvents;
