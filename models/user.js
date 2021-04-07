module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    instanceMethods: {
      toJSON: function () {
        const values = Object.assign({}, this.get());

        delete values.password;
        return values;
      }
    }
  });

  return User;
}
