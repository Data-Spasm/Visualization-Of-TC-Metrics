import API_BASE from "../utils/api";

const RoleController = {
  async getRoleById(id) {
    const response = await fetch(`${API_BASE}/api/roles/${id}`);
    if (!response.ok) throw new Error("Failed to fetch role by ID");
    return response.json();
  },

  async getAllRoles() {
    const response = await fetch(`${API_BASE}/api/roles`);
    if (!response.ok) throw new Error("Failed to fetch roles");
    return response.json();
  }
};

export default RoleController;
