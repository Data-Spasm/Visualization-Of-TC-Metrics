// src/controllers/RoleController.js
import Role from '../models/RoleModel';

class Role {
  // Get role by ID
  static getRoleById(id) {
    return Role.getRoleById(id);
  }

  // Get all roles
  static getAllRoles() {
    return Role.getAllRoles();
  }
}

export default Role;
