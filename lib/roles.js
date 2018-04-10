module.exports = {
  sysadmin: 0,       // owner of the system
  admin: 1,     // full permissions except deleting system owner
  moderator: 2, // admin with view permissions and limited write permissions
  user: 5,      // regular user
  guest: 10,    // unidentified user

  exists(role) {
    return (this[role] >= 0) && (typeof this[role] === 'number');
  },

  isSysAdmin(role) {
    return this[role] === this.sysadmin;
  },

  isAdmin(role) {
    return this[role] <= this.admin;
  },

  isSuperUser(role) {
    return this[role] < this.user;
  },

  get userLevel() {
    return this.user;
  },

  validate(userRole, requiredRole) {
    return this[userRole] <= this[requiredRole];
  }
};
