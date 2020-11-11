const path = require("path");

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
    },
  },
};
