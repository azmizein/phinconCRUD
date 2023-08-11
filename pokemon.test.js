const axios = require("axios");
const jsonfile = require("jsonfile");
const {
  getAll,
  getBy,
  getMy,
  catchPokemon,
  prime,
  isPrime,
  getFibonacciNumber,
  renamePokemonWithFibonacci,
} = require("../back-end/controllers/pikachu");
const mockData = require("./pokemon.json");
const uuid = require("uuid");

jest.mock("axios");
jest.mock("jsonfile");

describe("Express Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  //Module Export Get All
  it("should get all Pokemon success", async () => {
    const response = {
      data: {
        results: [{ name: "pokemon1" }, { name: "pokemon2" }],
      },
    };

    axios.get.mockResolvedValue(response);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getAll(req, res);

    expect(axios.get).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon/"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(["pokemon1", "pokemon2"]);
  });

  it("should send an error response when the request fails", async () => {
    const errorMessage = "Network error";
    axios.get.mockRejectedValue(errorMessage);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(errorMessage);
  });
  // <--------------------------------------------------> //

  //Module Export Get By
  it("should get a specific Pokemon by name", async () => {
    const response = {
      data: {
        name: "pokemon1",
      },
    };

    axios.get.mockResolvedValue(response);

    const req = {
      params: { name: "pokemon1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getBy(req, res);

    expect(axios.get).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon/pokemon1"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(response.data);
  });

  it("should send an error response when the request fails get pokemon name", async () => {
    const errorPokemon = "Pokemon not found";
    axios.get.mockRejectedValue(errorPokemon);

    const req = {
      params: { name: "pokemon1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getBy(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(errorPokemon);
  });
  // <--------------------------------------------------> //

  //  Get My Pokemon From Pokedeck
  it("should send the data from the jsonfile when the request succeeds", async () => {
    jsonfile.readFileSync.mockReturnValue(mockData);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getMy(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockData.pokemon);
  });

  it("should send an error reading the data", async () => {
    const errorMessage = "Failed to read data";
    jsonfile.readFileSync.mockImplementation(() => {
      throw errorMessage;
    });

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getMy(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(errorMessage);
  });
  // <--------------------------------------------------> //

  // Catch Pokemon
  it("should handle successful catch and add the caught Pokemon to the list", async () => {
    const response = {
      data: {
        results: [
          { name: "pokemon1" },
          { name: "pokemon2" },
          { name: "pokemon3" },
        ],
      },
    };

    axios.get.mockResolvedValue(response);
    Math.random = jest.fn().mockReturnValue(0.7);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await catchPokemon(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
    });
  });

  it("should handle unsuccessful catch", async () => {
    const mockAxiosResponse = {
      data: {
        results: [
          { name: "pokemon1" },
          { name: "pokemon2" },
          { name: "pokemon3" },
        ],
      },
    };

    axios.get.mockResolvedValue(mockAxiosResponse);
    Math.random = jest.fn().mockReturnValue(0.5);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    await catchPokemon(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "You didn't catch pokemon",
    });
  });

  it("should handle axios error", async () => {
    axios.get.mockRejectedValue("Axios error 123");

    await catchPokemon(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("Axios error 123");
  });
  // <--------------------------------------------------> //

  // Prime and rename
});

describe("Helper Functions", () => {
  it("should return false for numbers less than 2", () => {
    expect(isPrime(0)).toBe(false);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(-1)).toBe(false);
  });

  it("should return true for the number 2", () => {
    expect(isPrime(2)).toBe(true);
  });

  it("should return true for prime numbers greater than 2", () => {
    expect(isPrime(3)).toBe(true);
    expect(isPrime(5)).toBe(true);
    expect(isPrime(7)).toBe(true);
  });

  it("should return false for non-prime numbers greater than 2", () => {
    expect(isPrime(4)).toBe(false);
    expect(isPrime(6)).toBe(false);
    expect(isPrime(8)).toBe(false);
  });

  it("should get the nth Fibonacci number", () => {
    expect(getFibonacciNumber(1)).toBe(1);
    expect(getFibonacciNumber(5)).toBe(3);
  });

  it("should rename a Pokemon with Fibonacci count", () => {
    const newName = renamePokemonWithFibonacci("pikachu", 3);
    expect(newName).toBe("pikachu-1");
  });
});
