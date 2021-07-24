const allRoles = {
  user: [],
  admin: [
    'getUsers',
    'manageUsers',
    'getDashboard',
    'getEmployees',
    /* Categories Order */
    'getOrders',
    'approveOrder',
    /* Categories Admin */
    'getCategory',
    'getCategories',
    'createCategory',
    'updateCategory',

    /* Products Admin */
    'getProducts',
    'createProduct',
    'deleteProduct',

    /* Employee Admin */
    'getEmployees',
    'createEmployee',
    'deleteEmployee',

    /* Barcodes Admin */
    'getBarcode',
    'getBarcodes',
    'createBarcode',
    'deleteBarcode',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
