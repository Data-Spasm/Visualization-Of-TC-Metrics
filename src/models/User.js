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

  static getStudentsByTeacher(teacherUsername) {
    const teacher = users.find(u => u.username === teacherUsername && u.teacher);
    if (!teacher) return [];

    const studentUsernames = teacher.teacher.studentNames;
    return users.filter(u => studentUsernames.includes(u.username));
  }
}

export default User;