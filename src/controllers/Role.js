const RoleController = {
  async getRoleById(id) {
    const response = await fetch(`/api/roles/${id}`);
    if (!response.ok) throw new Error("Failed to fetch role by ID");
    return response.json();
  },

  async getAllRoles() {
    const response = await fetch(`/api/roles`);
    if (!response.ok) throw new Error("Failed to fetch roles");
    return response.json();
  }
};

export default RoleController;
