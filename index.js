const express = require("express");
const PORT = 2000;
const server = express();

server.use(express.json());

const { userRoutes, pokemonRoutes } = require("./routers");

server.use("/user", userRoutes);
server.use("/pokemon", pokemonRoutes);

server.listen(PORT, () => {
  console.log("Success Running at PORT: " + PORT);
});
