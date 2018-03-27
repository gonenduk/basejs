module.exports = {
  god: 0,
  admin: 1,
  moderator: 2,
  user: 5,
  guest: 10,

  get default() {
    return 'guest';
  },
  exists(role) {
    return this[role] >= 0;
  },
  isAdmin(role) {
    return this[role] <= this.admin;
  },
  validate(userRole, requiredRole) {
    return this[userRole] <= this[requiredRole];
  }
};
