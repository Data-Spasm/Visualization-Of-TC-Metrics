const AvatarController = {
  async getAvatarById(id) {
    const response = await fetch(`/api/avatars/${id}`);
    if (!response.ok) throw new Error("Failed to fetch avatar by ID");
    return response.json();
  },

  async getAllAvatars() {
    const response = await fetch(`/api/avatars`);
    if (!response.ok) throw new Error("Failed to fetch avatars");
    return response.json();
  }
};

export default AvatarController;
