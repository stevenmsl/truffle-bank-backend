/* #TA-02 */
module.exports = require("./deploy_contracts")(artifacts, web3);

// const ConvertLib = artifacts.require("ConvertLib");
// const MetaCoinToBeDeployed = artifacts.require("MetaCoin");

// module.exports = function(deployer) {
//   deployer.deploy(ConvertLib);
//   deployer.link(ConvertLib, MetaCoinToBeDeployed);
//   deployer.deploy(MetaCoinToBeDeployed);
// };
