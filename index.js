const express = require("express");
const PORT = 2000;
const server = express();

server.use(express.json());
server.use(express.static("./Public"));

const { userRoutes } = require("./routers");

server.use("/user", userRoutes);

server.listen(PORT, () => {
  console.log("Success Running at PORT: " + PORT);
});
