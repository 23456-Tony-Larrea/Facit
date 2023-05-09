import React, { useState } from 'react';
import Button from '../../../components/bootstrap/Button'
import ListGroup from '../../../components/bootstrap/ListGroup';
import ListGroupItem from '../../../components/bootstrap/ListGroup';


const MainRole = () => {
    const [roles, setRoles] = useState(['Administrador', 'Editor', 'Usuario']);
    const [permissions, setPermissions] = useState([true, false, true]);
  
    const handleAddRole = () => {
      const newRole = prompt('Ingrese el nombre del nuevo rol');
      if (newRole) {
        setRoles([...roles, newRole]);
        setPermissions([...permissions, false]);
      }
    };
  
    const handlePermissionToggle = (index: number) => {
      const newPermissions = [...permissions];
      newPermissions[index] = !newPermissions[index];
      setPermissions(newPermissions);
    };
  
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h2>Roles</h2>
            <ListGroup>
              {roles.map((role) => (
                <ListGroupItem key={role}>
                  <span>{role}</span>
                </ListGroupItem>
              ))}
            </ListGroup>
            <Button color='info' onClick={handleAddRole}>
            </Button>
          </div>
          <div className="col-md-6">
            <h2>Permisos</h2>
            <ListGroup>
              {permissions.map((permission, index) => (
                <ListGroupItem key={index}>
                  <div>
                    {`Permiso ${index + 1}`}{' '}
                    <input
                      type="checkbox"
                      checked={permission}
                      onChange={() => handlePermissionToggle(index)}
                    />
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
    );
  };
  
export default MainRole;