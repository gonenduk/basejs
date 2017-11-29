module.exports = {
	admin: 0,
	user: 5,
	guest: 10,

	get default() {
		return 'guest';
	},
	exists(role) {
		return this[role] >= 0;
	},
	validate(userRole, requiredRole) {
		return this[userRole] <= this[requiredRole];
	}
};
