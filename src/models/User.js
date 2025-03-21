// src/models/UserModel.js
// This file is used to interact with the users data
import { users, roles } from '../utils/loadData';

class User {
  static getUserByUsername(username) {
    return users.find(user => user.username === username);
  }

  static getAllUsers() {
    return users;
  }

  static getUsersByRole(roleName) {
    const role = roles.find(r => r.name === roleName);
    if (!role) return [];
    return users.filter(user =>
      user.roles.some(userRole => userRole.$id.$oid === role._id.$oid)
    );
  }
}

export default User;