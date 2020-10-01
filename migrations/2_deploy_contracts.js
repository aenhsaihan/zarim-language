var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Zarim = artifacts.require("./Zarim.sol");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Zarim);
};
