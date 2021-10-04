import { expect } from "chai";

/* second approach 
  - use a different approach here
    - assume the contracts have just been deployed 
      to Ganache before running tests
    - get the instance from the deployed contracts
      instead of instantiating it from the contract
      directly using the new() creator function
  - use this command to deploy contract and run tests
    - npm run test-redeploy
  - pros
    - you are testing the contracts as is:
      - you don't need to re-implement the tokens
        transferring logic resided in the migration
        script
  - cons
    - you can't tear down and re-create the contracts
      by redeploying them in-between tests which might 
      cause unwanted side-effects as the state changed
      by one test might affect the outcome of another         
     
*/

contract("DecentralBank Approach 2", async ([owner, customer]) => {
  const tetherContract = artifacts.require("Tether");
  const rwdContract = artifacts.require("RWD");
  const decentralBankContract = artifacts.require("DecentralBank");

  function tokens(number: string) {
    return web3.utils.toWei(number, "ether");
  }

  describe("Mock Tether Deployment", async () => {
    it("matches name successfully", async () => {
      const tether = await tetherContract.deployed();
      const name = await tether.name();
      expect(name).to.equal("Mock Tether Token");
    });
  });
});
