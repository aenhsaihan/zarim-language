const path = require("path");

const HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC =
  "hood slender swallow exact venue fence depart coil boring twice mango deposit";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  compilers: {
    solc: {
      version: "^0.6.0",
    },
  },
  contracts_build_directory: path.join(__dirname, "client/ethereum/build"),
  networks: {
    develop: {
      port: 8545,
      network_id: "*",
    },
    ganache: {
      host: "localhost",
      port: 8545,
      network_id: "5777",
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(
          MNEMONIC,
          "https://ropsten.infura.io/v3/72a3f9acefc6439ca97271a80dfeeff9"
        );
      },
      network_id: 3,
      gas: 4000000, //make sure this gas allocation isn't over 4M, which is the max
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(
          MNEMONIC,
          "https://kovan.infura.io/v3/72a3f9acefc6439ca97271a80dfeeff9"
        );
      },
      network_id: 42,
      gas: 4000000, //make sure this gas allocation isn't over 4M, which is the max
    },
  },
};
