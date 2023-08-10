const express = require("express");
const jsonfile = require("jsonfile");
const dbFilePath = "pokemon.json";
const axios = require("axios");
const data = jsonfile.readFileSync(dbFilePath);
const uuid = require("uuid");
const app = express();

app.use(express.json());

const isPrime = (n) => {
  if (n < 2) {
    return false;
  }
  for (let i = 2; i < n; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
};

const getFibonacciNumber = (n) => {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  let a = 0,
    b = 1,
    temp;
  for (let i = 2; i < n; i++) {
    temp = a + b;
    a = b;
    b = temp;
  }
  return b;
};

const renamePokemonWithFibonacci = (newName, count) => {
  const splitName = newName.split("-");
  const originalName = splitName[0];
  const fiboKey = getFibonacciNumber(count);
  return originalName + "-" + fiboKey;
};

module.exports = {
  getAll: async (req, res) => {
    try {
      const response = await axios.get("https://pokeapi.co/api/v2/pokemon/");
      const pokemonList = response.data.results.map((pokemon) => pokemon.name);
      res.status(200).send(pokemonList);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  getBy: async (req, res) => {
    try {
      const pokemonName = req.params.name;
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      res.status(200).send(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        res.status(404).send("Pokemon not found");
      } else {
        res.status(500).send("Error fetching Pokémon data");
      }
    }
  },

  catch: async (req, res) => {
    try {
      const response = await axios.get("https://pokeapi.co/api/v2/pokemon/");
      const pokemons = response.data.results.map((pokemon) => pokemon.name);

      const randomIndex = Math.floor(Math.random() * pokemons.length);
      const randomPokemon = pokemons[randomIndex];

      if (Math.random() < 0.5) {
        data.pokemon.push({
          id: uuid.v4(),
          name: randomPokemon,
        });

        jsonfile.writeFileSync(dbFilePath, data);

        res.status(200).json({
          success: true,
          message: `You caught a ${randomPokemon.name}! Added to your mypokemon list.`,
          data,
        });
      } else {
        res.status(400).json({
          success: true,
          message: `You didn't catch pokemon`,
        });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  },

  getMy: async (req, res) => {
    try {
      const getData = data.pokemon;
      res.status(200).send(getData);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  prime: async (req, res) => {
    try {
      const { id } = req.body;
      const minNumber = 1;
      const maxNumber = 100;

      const randomNum =
        Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;

      if (isPrime(randomNum)) {
        const releasedPokemon = data.pokemon.find(
          (pokemon) => pokemon.id === id
        );

        if (!releasedPokemon) {
          return res.status(404).json({ error: "Pokemon not found" });
        }

        const newName = renamePokemonWithFibonacci(
          releasedPokemon.name,
          releasedPokemon.renameCount || 0
        );

        releasedPokemon.name = newName;
        releasedPokemon.renameCount = (releasedPokemon.renameCount || 0) + 1;

        jsonfile.writeFileSync(dbFilePath, data);

        return res.status(200).json({
          success: true,
          message: `Renamed Pokémon successfully to ${newName}`,
          data,
        });
      } else {
        return res
          .status(400)
          .json({ error: "Number is not prime. Pokémon rename failed." });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
