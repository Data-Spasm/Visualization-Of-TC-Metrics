// src/controllers/AvatarController.js
import Avatar from '../models/Avatar';

class Avatar {
  // Get avatar by ID
  static getAvatarById(id) {
    return Avatar.getAvatarById(id);
  }

  // Get all available avatars
  static getAllAvatars() {
    return Avatar.getAllAvatars();
  }
}

export default Avatar;
