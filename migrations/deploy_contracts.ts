import {
  TetherContract,
  RWDContract,
  DecentralBankContract,
} from "../types/truffle-contracts";
type Network = "development" | "test";

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  return async (
    deployer: Truffle.Deployer,
    network: Network,
    accounts: Truffle.Accounts
  ) => {
    const Tether: TetherContract = artifacts.require("Tether");
    const RWD: RWDContract = artifacts.require("RWD");
    const DecentralBank: DecentralBankContract =
      artifacts.require("DecentralBank");

    /*
      - you still need to await the deploy even
        though the linting tool say it has no
        effect
      - if you don't await for it you will receive 
        network/artifact mismatch error when you deploy
        contracts right after you run "truffle networks --clean"
        to wipe all deployed contracts
        
    */
    await deployer.deploy(Tether);
    const tether = await Tether.deployed();
    await deployer.deploy(RWD);
    const rwd = await RWD.deployed();

    await deployer.deploy(DecentralBank, rwd.address, tether.address);
    const decentralBank = await DecentralBank.deployed();
    // Transfer all tokens to DecentralBank (1 million)
    await rwd.transfer(decentralBank.address, "1000000000000000000000000");
    // Transfer 100 Mock Tether tokens to investor
    await tether.transfer(accounts[1], "100000000000000000000");
  };
};
