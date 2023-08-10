const jsonfile = require("jsonfile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbFilePath = "db.json";
const data = jsonfile.readFileSync(dbFilePath);

module.exports = {
  register: async (req, res) => {
    try {
      const { username, phoneNumber, gender, email, password } = req.body;
      if (password.length < 8) throw "Minimum 8 characters";

      const salt = await bcrypt.genSalt(10);

      const hashPass = await bcrypt.hash(password, salt);

      if (!username || !phoneNumber || !gender || !email || !password) {
        return res.status(400).send({
          message: "Form cannot be null",
        });
      }

      const existUser = data.user.find((user) => user.username === username);
      if (existUser) {
        return res.status(400).send({
          message: "Username already taken",
        });
      }

      const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailValidation.test(email)) {
        return res.status(400).send({
          message: "Invalid email",
        });
      }

      data.user.push({
        username,
        phoneNumber,
        gender,
        email,
        password: hashPass,
      });

      jsonfile.writeFileSync(dbFilePath, data);

      const token = jwt.sign({ username: username }, "azmi");

      res.status(200).send({
        message: "Register Success",
        token,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  delete: (req, res) => {
    try {
      const nameDelete = req.params.username;

      const updateUser = data.user.filter(
        (user) => user.username !== nameDelete
      );

      data.user = updateUser;

      jsonfile.writeFileSync(dbFilePath, data);

      res.status(200).send("Delete Success");
    } catch (err) {
      res.status(400).send(err);
    }
  },

  getAll: (req, res) => {
    try {
      const getUsers = data.user;

      res.status(200).send(getUsers);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  getBy: (req, res) => {
    try {
      const getUser = req.params.username;

      const userBy = data.user.find((user) => user.username === getUser);
      if (!userBy) {
        return res.status(400).send({
          message: "User not found",
        });
      }

      res.status(200).json(userBy);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  update: async (req, res) => {
    try {
      const { username, phoneNumber, gender, email, password } = req.body;

      const updateData = req.params.username;

      const newData = data.user.find((user) => user.username === updateData);

      const existUser = data.user.find((user) => user.username === username);
      if (!newData) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      if (existUser) {
        return res.status(400).send({
          message: "Username already taken",
        });
      }

      const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailValidation.test(email)) {
        return res.status(400).send({
          message: "Invalid email",
        });
      }

      if (username) newData.username = username;
      if (phoneNumber) newData.phoneNumber = phoneNumber;
      if (gender) newData.gender = gender;
      if (email) newData.email = email;

      if (password) {
        if (password.length < 8) throw "Minimum 8 characters";

        const salt = await bcrypt.genSalt(10);

        const hashPass = await bcrypt.hash(password, salt);

        newData.password = hashPass;
      }

      jsonfile.writeFileSync(dbFilePath, data);

      res.status(200).send({
        user: newData,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
