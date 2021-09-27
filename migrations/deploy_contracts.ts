type Network = "development" | "test";

/* TA-03 */
module.exports = (artifacts: any /* #TA-04 */, web3: Web3) => {
  return async (
    deployer: Truffle.Deployer,
    network: Network,
    accounts: Truffle.Accounts
  ) => {
    const Tether = artifacts.require("Tether");
    deployer.deploy(Tether);
    // deployer.link(ConvertLib, MetaCoin);
  };
};
