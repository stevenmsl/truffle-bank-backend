import { expect } from "chai";

/* 
  - use a different approach here
    - assume the contracts have just been deployed 
      to Ganache before running tests
    - get the instance from the deployed contracts
      instead of instantiating it from the contract
      directly using the new() creator function
  - use this command to deploy contract and run tests
    - npm run dtest  
     
*/

contract("DecentralBank", async ([owner, customer]) => {
  //const decentralBankContract = artifacts.require("DecentralBank");
  function tokens(number: string) {
    return web3.utils.toWei(number, "ether");
  }
});
