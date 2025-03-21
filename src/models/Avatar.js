// src/models/AvatarModel.js
// This file is used to interact with the avatar data
import { avatars } from '../utils/loadData';

class Avatar {
  static getAvatarById(id) {
    return avatars.find(avatar => avatar._id.$oid === id);
  }

  static getAllAvatars() {
    return avatars;
  }
}

export default Avatar;
