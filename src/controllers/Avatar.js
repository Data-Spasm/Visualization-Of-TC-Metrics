// src/controllers/AvatarController.js
import AvatarModel from '../models/Avatar';

class AvatarController {
  // Get avatar by ID
  static getAvatarById(id) {
    return AvatarModel.getAvatarById(id);
  }

  // Get all available avatars
  static getAllAvatars() {
    return AvatarModel.getAllAvatars();
  }
}

export default AvatarController;
