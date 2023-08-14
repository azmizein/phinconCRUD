const express = require("express");
const PORT = 2000;
const server = express();
const db = require("./models");

server.use(express.json());

const { userRoutes, pokemonRoutes, userSeqRoutes } = require("./routers");

server.use("/user", userRoutes);
server.use("/pokemon", pokemonRoutes);
server.use("/userSeq", userSeqRoutes);

server.listen(PORT, () => {
  db.sequelize.sync({ alter: true });
  console.log("Success Running at PORT: " + PORT);
});
