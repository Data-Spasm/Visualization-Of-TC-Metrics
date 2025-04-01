import API_BASE from "../utils/api";

const AvatarController = {
  async getAvatarById(id) {
    const response = await fetch(`${API_BASE}/api/avatars/${id}`);
    if (!response.ok) throw new Error("Failed to fetch avatar by ID");
    return response.json();
  },

  async getAllAvatars() {
    const response = await fetch(`${API_BASE}/api/avatars`);
    if (!response.ok) throw new Error("Failed to fetch avatars");
    return response.json();
  }
};

export default AvatarController;
