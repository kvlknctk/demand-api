const allRoles = {
  user: [],
  admin: [
    'getUsers',
    'manageUsers',
    'getDashboard',
    'getEmployees',
    /* Categories Order */
    'getOrders',
    /* Categories Admin */
    'getCategory',
    'getCategories',
    'createCategory',
    'updateCategory',

    /* Products Admin */
    'getProducts',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
