import React, { FC, useState,useEffect, ChangeEvent } from 'react';
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
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import data from '../../../common/data/dummyEventsData';
import Avatar from '../../../components/Avatar';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import useDarkMode from '../../../hooks/useDarkMode';
import Modal, {ModalBody,ModalFooter,ModalHeader,ModalTitle,} from '../../../components/bootstrap/Modal';
import axios from 'axios';
import { API_URL } from '../../../constants';

import User1Webp from '../../../assets/img/wanna/wanna2.webp';
import User1Img from '../../../assets/img/wanna/wanna2.png';
import {TModalSize } from '../../../type/modal-type';
import showNotification from '../../../components/extras/showNotification';
import Checks from '../../../components/bootstrap/forms/Checks';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';



interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}
interface IAgency{
	id: undefined;
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
	id_canton: undefined;
	id_province: undefined;
	logo_path: string;

}
interface IProvince{
	id:undefined;
	name:undefined;
}
interface ICanton{
	id:undefined;
	name:undefined;
}
interface ICustomerEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

interface ICompany{
	id:undefined;
	business_name:undefined;
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

	

const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPhoto(URL.createObjectURL(file));
    }
  };
  const handleDeletePhoto = () => {
    setSelectedPhoto(null);
  };


	
	const { themeStatus, darkModeStatus } = useDarkMode();
  const [agency, setAgency] = useState<IAgency[]>([]);
  const [province, setProvince] = useState<IProvince[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [canton, setCanton] = useState<ICanton[]>([]);
  	const ADD_TITLE = 'Nueva Agencia';
	const EDIT_TITLE = 'Editar Agencia';
	const [modalTitle, setModalTitle] = useState('');
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
	const [selectedId, setSelectedId] = useState(null);
	const [company, setCompany] = useState <ICompany[]>([]);
	const [iva_Holiday, setIva_Holiday] = useState<boolean>(false);
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
			establishment_code: '',
			emission_code: '',
			matriz:undefined,
			state:undefined,
			tradename: '',
			whatsapp: '',
			landline: '',
			id_canton:undefined,
			id_province:undefined,
			logo_path: '',
			action: '',
			business_name: ''
		},
		validate: values => {
			const errors: any = {};
			if (!values.tradename) {
				errors.tradename = 'Requerido';
			}	
			if (!values.id_province) {
				errors.id_province = 'Debe seleccionar una Provincia';
			  }
			  if (!values.id_canton) {
				errors.id_canton = 'Debe seleccionar un Cantón';
			  }
			  if (!values.id_company) {
				errors.id_company = 'Debe seleccionar una Empresa';
			  }
			  if (!values.establishment_code) {
				errors.establishment_code = 'Requerido';
		} else if (!/^[0-9]{3}$/i.test(values.establishment_code)) {
			errors.establishment_code = 'El codigo debe tener al menos 3 caracteres';
		}
		if (!values.emission_code) {
			errors.emission_code = 'Requerido';
	}else if (!/^[0-9]{3}$/i.test(values.emission_code)){
		errors.emission_code = 'El codigo debe tener al menos 3 caracteres';
	}
	if (!values.landline) {
		errors.landline = 'Requerido';
} else if (!/^[0-9]{10}$/i.test(values.landline)){
	errors.landline = 'El telefono debe tener al menos 10 caracteres';
}
if (!values.whatsapp) {
	errors.whatsapp = 'Requerido';
} else if (!/^[0-9]{10}$/i.test(values.whatsapp)){
	errors.whatsapp = 'El whatsapp debe tener al menos 10 caracteres';
}
if (!values.address) {
	errors.address = 'Requerido';
}
if (!values.description) {
	errors.description = 'Requerido';
}



			  
			
			

			return errors;
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
		const getProvince = () => {
			axios.get(`${API_URL}province`)
			.then(response => {
			setProvince(response.data);
			console.log(response.data);
			
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
					console.log(response.data);
				  })
				  .catch(error => {
					console.log(error);
				  });
			  };
		 const getCompany = () => {
			axios.get(`${API_URL}company`)
			.then(response => {
			setCompany(response.data.data);
			console.log("this is company",response.data.data);

			})
			.catch(error => {
			console.log(error);
			});
			};

	useEffect(() => {
		getAgency();
		getProvince();
		getCompany();
		}, []);		
	
	const clearId = () => {
		const id = formik.values.id;
		if (id) {
			formik.setFieldValue('id', undefined);
		}
	};
	const addAgency = async (values: any) => {
		
		try {
		  if (formik.values.id) {
				console.log("this is my id",formik.values.id);

				await axios.put(`${API_URL}agency/${formik.values.id}`,{
					address: formik.values.address,
					description: formik.values.description,
					landline: formik.values.landline,
					id_company: formik.values.id_company,
					iva_holiday: formik.values.iva_holiday,
					establishment_code: formik.values.establishment_code,
					emission_code: formik.values.emission_code,
					matriz: formik.values.matriz,
					state: formik.values.state,
					tradename: formik.values.tradename,
					whatsapp: formik.values.whatsapp,
					id_canton: formik.values.id_canton,
					id_province: formik.values.id_province,
					logo_path: formik.values.logo_path,
				});
				setIsOpenModal(false);
				showNotification("Exito", "Agencia actualizada correctamente","success");
			} else {
				await axios.post(`${API_URL}agency`,{
					address: formik.values.address,
					description: formik.values.description,
					landline: formik.values.landline,
					id_company: formik.values.id_company,
					iva_holiday: formik.values.iva_holiday,
					establishment_code: formik.values.establishment_code,
					emission_code: formik.values.emission_code,
					matriz: formik.values.matriz,
					tradename: formik.values.tradename,
					whatsapp: formik.values.whatsapp,
					id_canton: formik.values.id_canton,
					id_province: formik.values.id_province,
					logo_path: formik.values.logo_path,
					action: formik.values.action,
					
				});
				setIsOpenModal(false);
				showNotification("Exito", "Agencia creada correctamente","success");
			}
			
			getAgency();
			setIsOpenModal(false);
		} catch (error) {
			console.log(error);
		}

	}
	
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const { items, requestSort, getClassNamesFor } = useSortableData(data);
	const [sizeStatus, setSizeStatus] = useState<TModalSize>(null);
	

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
				
					onClick={() => {
						setIsEditMode(false);
						setModalTitle(ADD_TITLE);
						setIsOpenModal(true);
						formik.resetForm();
						clearId();
					}
				}
				//commit
					>
					Nuevo
					</Button>
						
					</CardActions>
				</CardHeader>
				<CardBody className='table-responsive' isScrollable={isFluid}>
<table className='table table-modern'>
  <thead>
    <tr>
      <th className='col-sm-2'  >
        PROVINCIA
      </th>
      <th className='col-sm-2' >
        CANTON
      </th>
      <th className='col-sm-2' >
        EMPRESA
      </th>
      <th className='col-sm-2'>
   		 NOMBRE 
      </th>
      <th className='col-sm-2' >
        C. ESTABLECIMIENTO
      </th>
      <th className='col-sm-2'>
	  	C. EMISION
      </th>
      <th className='col-sm-2'>
        ESTADO
      </th>
       {/* <th className='col-sm-2'>
	    Telefono
		</th> 
		<th className='col-sm-2'>
		matriz
		</th>
		<th className='col-sm-2'>
		direnccion
		</th>
		<th className='col-sm-2'>
		Whatsapp
		</th>
		<th className='col-sm-2'>
		Usuarios
		</th>
		<th className='col-sm-2'>
		logo
		</th>
		<th className='col-sm-2'>
		iva
		</th> */}
		<th className='col-sm-2'>
		ACCIONES
		</th>
    </tr>
  </thead>
  <tbody>
  {dataPagination(agency, currentPage, perPage).map((item) => (
								<tr key={item.id}>
									<td className='col-sm-2'>
									{item.id_province ? item.id_province.name : "Sin ninguna Provincia"}
									</td>
									<td className='col-sm-2'>
									{item.id_canton ? item.id_canton.name : "Sin ningún canton"}
									</td>
									<td className='col-sm-2'>
									{item.id_company ? item.id_company.business_name : "Sin ninguna compania"}
									</td>
									<td className='col-sm-'>
										{item.tradename}
									</td>
									<td className='col-sm-2'>
										{item.establishment_code}
									</td>
									<td className='col-sm-2'>
										{item.emission_code}
									</td>
									<td>
{item.state === true ? (
<Button isLink color="success" icon="Circle" className="text-nowrap">
Activo
</Button>
) : (
<Button isLink color="danger" icon="Circle" className="text-nowrap">
Inactivo
</Button>
)}
</td>
									{/* <td className='col-sm-2'>
									{item.logo_path}
									</td>
									<td className='col-sm-2'>
									{item.matriz}
									</td>
									<td className='col-sm-2'>
									{item.tradename}
									</td>
									<td className='col-sm-2'>
									{item.whatsapp}
									</td>
									<td className='col-sm-2'>
									{item.id_canton}
									</td>
									<td className='col-sm-2'>
									{item.id_province}
									</td> */} 
									
									
									<td className='col-sm-2'>
									<Button icon='Edit' color='primary' isLight data-tour='filter ' className='ms-2' aria-label='Edit'  onClick={() => {(item)
						setIsOpenModal(true);
						setModalTitle(EDIT_TITLE);
						setIsEditMode(true);
						formik.setValues(item);
						formik.setFieldValue('id', item.id);
						formik.setFieldValue('address', item.address);
						formik.setFieldValue('description', item.description);
						formik.setFieldValue('emission_code', item.emission_code);
						formik.setFieldValue('establishment_code', item.establishment_code);
						formik.setFieldValue('iva_holiday', item.iva_holiday);
						formik.setFieldValue('landline', item.landline);
						formik.setFieldValue('logo_path', item.logo_path);
						formik.setFieldValue('matriz', item.matriz);
						formik.setFieldValue('state', item.state);
						formik.setFieldValue('tradename', item.tradename);
						formik.setFieldValue('whatsapp', item.whatsapp);
						formik.setFieldValue('id_canton', item.id_canton);
						formik.setFieldValue('id_province', item.id_province);
						formik.setFieldValue('id_company', item.id_company);
						setSelectId(item.id);

					}}>
						</Button>
          
      {/*    <Button isLight data-tour='filter ' icon='Delete' color='danger' className='ms-5' aria-label='Delete' onClick={() => { 
						deleteRole(item.id);

			 }}> 
           </Button> */}
          
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
		
						<Modal
						isCentered
						isScrollable
						size='xl'
						isOpen={isOpenModal} setIsOpen={setIsOpenModal} >
			<ModalHeader setIsOpen={setIsOpenModal}
			 >
			<ModalTitle id='tour-title' className='d-flex align-items-end'>
			<span className='ps-2'>
			<h3 className=''>{modalTitle}</h3>			
			</span>
			</ModalTitle>
			</ModalHeader>
			<ModalBody >
			<div className='row justify-content-end'>
  			<div className='col-md-5'>
			<div>
			<Card>
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
			<CardHeader>
				<CardLabel icon='ReceiptLong'>
				<CardTitle>Elegir</CardTitle>
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
  <Dropdown>
    <DropdownToggle>
      <Button>
        {formik.values.id_company ?
          company.find(company => company.id === formik.values.id_company)?.business_name || "Selecciona una empresa "
          : "Selecciona una empresa"
        }
      </Button>
    </DropdownToggle>
    <DropdownMenu style={{ maxHeight: '175px', overflowY: 'auto' }}>
      {company && company.slice(0, 1000).map((companys) => (
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
  {formik.errors.id_company && (
	<h1 className="invalid-feedback d-block">
	{formik.errors.id_company}
	</h1>
  )}
</CardBody>

															</Card>
															</div>
															
    							</div>
							
								
                                <div className='col-md-7'>
        						<Card>
         					 <CardBody  className='pt-0'>
							  <div className='row g-4'>
								
												<div className='col-md-16'>
											
						<CardHeader>
						<CardLabel icon='TextSnippet'>
						<CardTitle>Completar</CardTitle>
						</CardLabel>
							</CardHeader>
						<FormGroup 
						id='tradename' label='Nombre Comercial' className='col-md-10'>
							<Input 
							onChange={formik.handleChange}
							value={formik.values.tradename} 
		  					onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.tradename}
							invalidFeedback={formik.errors.tradename}
							validFeedback='Perfecto!'
							 />
						</FormGroup>
						<FormGroup id='establishment_code' label='Codigo Establecimiento' className='col-md-10'>
							<Input 
							onChange={formik.handleChange}
							 value={formik.values.establishment_code} 
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.establishment_code}
							invalidFeedback={formik.errors.establishment_code}
							max={3}
							validFeedback='Perfecto!'
							
							 />
						</FormGroup>

						<FormGroup id='emission_code' label='Codigo Emision' className='col-md-10'>
							<Input onChange={formik.handleChange}
							 value={formik.values.emission_code}
							 onBlur={formik.handleBlur}
							 isValid={formik.isValid}
							 isTouched={formik.touched.emission_code}
							 invalidFeedback={formik.errors.emission_code}
							 validFeedback='Perfecto!'
							 />
						</FormGroup>
						<FormGroup id='landline' label='Telefono' className='col-md-10'>
							<Input onChange={formik.handleChange}
							 value={formik.values.landline}
							 onBlur={formik.handleBlur}
							 isValid={formik.isValid}
							 isTouched={formik.touched.landline}
							 invalidFeedback={formik.errors.landline}
							 validFeedback='Perfecto!'
							 />
						</FormGroup>
						<FormGroup id='whatsapp' label='Whatsapp' className='col-md-10'>
							<Input onChange={formik.handleChange}
							 value={formik.values.whatsapp}
							 onBlur={formik.handleBlur}
							 isValid={formik.isValid}
							 isTouched={formik.touched.whatsapp}
							 invalidFeedback={formik.errors.whatsapp}
							 validFeedback='Perfecto!'

							 />
						</FormGroup>
						<FormGroup id='address' label='Direccion' className='col-md-10'>
							<Input onChange={formik.handleChange}
							 value={formik.values.address}
							 onBlur={formik.handleBlur}
							 isValid={formik.isValid}
							 isTouched={formik.touched.address}
							 invalidFeedback={formik.errors.address}
							 validFeedback='Perfecto!'
							 />
						</FormGroup>
						<FormGroup id='description' label='Descripción' className='col-md-10'>
							<Input onChange={formik.handleChange}
							 value={formik.values.description}
							 onBlur={formik.handleBlur}
							 isValid={formik.isValid}
							 isTouched={formik.touched.description}
							 invalidFeedback={formik.errors.description}
							 validFeedback='Perfecto!'
							 />
						</FormGroup>
						
							<CardBody>
								<Checks
									type='switch'
									id='flexSwitchCheckDefault'
									label='IVA 8% Feriado'
									name='defaultCheck'
									checked={iva_Holiday}
									onChange={() => {
										setIva_Holiday(!iva_Holiday);
										formik.setFieldValue('iva_holiday', !iva_Holiday);
									}}
								/>
							</CardBody>

						</div>
			</div>
						
						</CardBody>
						
        </Card>
		
								
							
			</div>
			
			</div>
			
			</ModalBody>
			<ModalFooter>
			
			<Button
			icon='Save'
			color='success'
			isLight
			onClick={() => {
				addAgency(formik.values);
				setIsOpenModal(false);
				
				
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
