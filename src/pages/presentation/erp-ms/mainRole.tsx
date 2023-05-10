import React, { useState } from "react";
import Button from "../../../components/bootstrap/Button";
import ListGroup from "../../../components/bootstrap/ListGroup";
import ListGroupItem from "../../../components/bootstrap/ListGroup";
import s from "../../../../src/modules/MainRoles.module.css";
import swal from "sweetalert2";

const MainRole = () => {
  const [roles, setRoles] = useState(["Administrador", "Editor", "Usuario"]);
  const [permissions, setPermissions] = useState([true, false, true]);

  const handleAddRole = async () => {
    // const newRole = prompt("Ingrese el nombre del nuevo rol");

    const { value: newRole } = await swal.fire({
      title: "Ingrese Nuevo Rol",
      icon: "info",
      input: "text",
      inputValue: "",
    });

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
    <div className={`container ${s.container}`}>
      <div className="row">
        <div className={`col-md-6 ${s.col}`}>
          <h2 className={s.TituloRolePermiso}>
            <i className="bi bi-person-rolodex"> </i>Roles
          </h2>
          <ListGroup>
            {roles.map((role) => (
              <ListGroupItem className={s.divconCheckBox} key={role}>
                <i className="bi bi-caret-right-fill">
                  <span> {role}</span>
                </i>
              </ListGroupItem>
            ))}
          </ListGroup>
          <Button className={s.buttonRole} color="info" onClick={handleAddRole}>
            <i className="bi bi-plus-lg"> Agregar Roles</i>
          </Button>
        </div>
        <div className={`col-md-6 ${s.col}`}>
          <h2 className={s.TituloRolePermiso}>
            <i className="bi bi-ui-checks"> </i>Permisos
          </h2>
          <ListGroup>
            {permissions.map((permission, index) => (
              <ListGroupItem key={index}>
                <div className={s.divconCheckBox}>
                  <i className="bi bi-caret-right-fill">
                    {` Permiso ${index + 1}`}{" "}
                  </i>
                  <label className={s.switch}>
                    <input
                      type="checkbox"
                      checked={permission}
                      onChange={() => handlePermissionToggle(index)}
                      className={s.checkbox}
                    />
                    <span className={s.slider}></span>
                  </label>
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
