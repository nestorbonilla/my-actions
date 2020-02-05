const ActionStorage = artifacts.require("ActionStorage");

module.exports = function(deployer) {
  deployer.deploy(ActionStorage);
};
