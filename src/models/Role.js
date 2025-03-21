// src/models/RoleModel.js
// This file is used to interact with the roles data
import { roles } from '../utils/loadData';

class Role {
  static getRoleById(id) {
    return roles.find(role => role._id.$oid === id);
  }

  static getAllRoles() {
    return roles;
  }
}

export default Role;
