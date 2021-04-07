const { User } = require('./models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_SAUCE = process.env.JWT_SECRET
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {
  user: async function (args, ctx) {
    const { token } = ctx;
    let validToken;

    if (!token) throw new Error('Forbidden access');

    try {
      validToken = jwt.verify(token, SECRET_SAUCE);
    } catch (e) {
      throw new Error('Forbidden access');
    }

    if (!validToken) throw new Error('Forbidden access');

    const { id } = args;
    let user;

    try {
      user = await User.findOne({
        where: { id: validToken.id || id }
      });
    } catch (e) {
      throw new Error(e);
    }

    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  },
  users: async function (args) {
    let users;
    try {
      users = await User.findAll();
    } catch (e) {
      throw new Error(e);
    }

    return users
  },
  login: async function (args) {
    const { email, password } = args
    let user;

    try {
      user = await User.findOne({
        where: { email: email }
      });
    } catch (e) {
      throw new Error(e.message);
    }

    if (!user) {
      throw new Error('Invalid email')
    }

    let check;
    try {
      check = await bcrypt.compare(password, user.password);
    } catch(e) {
      console.log(e.message);
      throw new Error('Invalid combination')
    }
    if (!check) {
      throw new Error('Invalid combination')
    }

    const token = jwt.sign(user.toJSON(), SECRET_SAUCE);

    return {
      token: token
    }
  },
  register: async function (args) {
    const { email, password, name } = args;

    if (!EMAIL_REGEX.test(email)) {
      throw new Error('Invalid email');
    }

    if (!email || !password || !name) {
      const fields = { email, password, name };
      const missingFields = Object.keys(fields).filter(function(field){
        if (!fields[field]) return field;
      });
      throw new Error(`Missing fields: ${missingFields.join(", ")}`);
    }

    const user = await User.findOne({
      where: { email: email }
    });
    if (user) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let newUser;
    try {
      newUser = await User.create({
        email,
        password: hashedPassword,
        name
      });
    } catch (e) {
      throw new Error(e);
    }

    return newUser.toJSON();
  }
}
