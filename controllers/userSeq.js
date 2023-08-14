const db = require("../models");
const user = db.User;
const bcrypt = require("bcrypt");

module.exports = {
  register: async (req, res) => {
    try {
      const {
        username,
        phoneNumber,
        gender,
        email,
        password,
        confirmPassword,
      } = req.body;

      if (!username || !phoneNumber || !gender || !email || !password) {
        return res.status(400).send({
          message: "Form cannot be null",
        });
      }

      const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailValidation.test(email)) {
        return res.status(400).send("Invalid email");
      }

      if (password != confirmPassword) throw "Wrong Password";

      if (password.length < 8) throw "Minimum 8 characters";

      const salt = await bcrypt.genSalt(10);

      const hashPass = await bcrypt.hash(password, salt);

      const data = await user.create({
        username,
        phoneNumber,
        gender,
        email,
        password: hashPass,
      });

      res.status(200).json({
        massage: "Register Succes",
        data,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const isUserExist = await user.findOne({
        where: {
          username: username ? username : "",
        },
        raw: true,
      });

      if (!isUserExist) throw "User not found";

      const isValid = await bcrypt.compare(password, isUserExist.password);

      if (!isValid) throw `Wrong password`;

      res.status(200).send({
        message: "Login Succes",
        isUserExist,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  findAllUser: async (req, res) => {
    try {
      const users = await user.findAll({ raw: true });
      return res.status(200).send(users);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  findById: async (req, res) => {
    try {
      const users = await user.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!users) throw "user not found";
      res.status(200).send(users);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  remove: async (req, res) => {
    try {
      const userToRemove = await user.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!userToRemove) {
        res.status(404).send("User not found");
        return;
      }

      await userToRemove.destroy();
      const users = await user.findAll();
      res.status(200).send(users);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  update: async (req, res) => {
    try {
      const { username, phoneNumber, gender, email, password } = req.body;
      const userToUpdate = await user.findOne({ where: { id: req.params.id } });
      if (!userToUpdate) {
        res.status(404).send("User not found");
        return;
      }

      if (password.length < 8) throw "Minimum 8 characters";

      const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailValidation.test(email)) {
        return res.status(400).send({
          message: "Invalid email",
        });
      }
      await user.update(
        {
          username,
          phoneNumber,
          gender,
          email,
          password,
        },
        {
          where: { id: req.params.id },
        }
      );
      const users = await user.findOne({ where: { id: req.params.id } });
      res.status(200).send(users);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
