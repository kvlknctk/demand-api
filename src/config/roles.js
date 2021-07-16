const allRoles = {
  user: [],
  admin: [
    'getUsers',
    'manageUsers',
    'getDashboard',
    'getEmployees',
    'getOrders',
    /* Categories Admin */
    'getCategory',
    'getCategories',
    'createCategory',
    'updateCategory',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
