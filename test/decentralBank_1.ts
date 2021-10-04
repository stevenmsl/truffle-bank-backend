import { expect } from "chai";
import exp from "constants";
import {
  DecentralBankInstance,
  RWDInstance,
  TetherInstance,
} from "../types/truffle-contracts";
/* first approach
  - pros
    - you can tear down the contracts in-between tests and hence
      avoid any unwanted side-effects caused by state not being
      the same when the contracts were first instantiated.      
    - don't need to re-deploy contracts
  - cons
    - you need to re-implement the logic (transferring tokens)
      in migrations and make sure they are consistent 

*/
contract("DecentralBank Approach 1", async ([owner, customer]) => {
  const tetherContract = artifacts.require("Tether");
  const rwdContract = artifacts.require("RWD");
  const decentralBankContract = artifacts.require("DecentralBank");

  let tether: TetherInstance,
    rwd: RWDInstance,
    decentralBank: DecentralBankInstance;

  function tokens(number: string) {
    return web3.utils.toWei(number, "ether");
  }

  before(async () => {
    tether = await tetherContract.new();
    rwd = await rwdContract.new();
    decentralBank = await decentralBankContract.new(
      rwd.address,
      tether.address
    );

    /* re-implement the logic in migrations */
    await rwd.transfer(decentralBank.address, tokens("1000000"));
    await tether.transfer(customer, tokens("100"), { from: owner });
  });

  describe("Mock Tether Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await tether.name();
      expect(name).to.equal("Mock Tether Token");
    });
  });

  describe("Reward Token Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await rwd.name();
      expect(name).to.equal("Reward Token");
    });
  });

  describe("Decentral Bank Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await decentralBank.name();
      expect(name).to.equal("Decentral Bank");
    });
    it("verifies the contract has 1000000 RWD tokens initially", async () => {
      let balance = await rwd.balanceOf(decentralBank.address);
      expect(balance.toString()).to.equal(tokens("1000000"));
    });
  });

  describe("Yield Farming", async () => {
    it("rewards tokens for staking", async () => {
      let amount: BN, status: boolean;

      amount = await tether.balanceOf(customer);

      /* 
        - initial Tether balance should be 
          100 for the customer 
      */
      expect(amount.toString()).to.equal(
        tokens("100"),
        "customer's Tether balance before staking should be 100"
      );

      /* 
        - customer deposits tether to the
          central bank
        - customer needs to approve the transfer 
          first as internally deposit uses transfer 
          from method of Tether   
      */
      await tether.approve(decentralBank.address, tokens("100"), {
        from: customer,
      });
      await decentralBank.depositTokens(tokens("100"), { from: customer });

      amount = await tether.balanceOf(customer);
      expect(amount.toString()).to.equal(
        tokens("0"),
        "customer's Tether balance should be 0 after the deposit"
      );

      amount = await tether.balanceOf(decentralBank.address);
      expect(amount.toString()).to.equal(
        tokens("100"),
        "bank's Tether balance should be 100 after the deposit"
      );

      status = await decentralBank.isStaking(customer);
      expect(status).to.equal(true, "customer is staking now");

      /* 
        - only owner of the contract can issue reward
          tokens  
      */
      await decentralBank.issueTokens({ from: owner });

      try {
        await decentralBank.issueTokens({ from: customer });
      } catch (err: any) {
        expect(err.reason).to.equal("caller must be the owner");
      }

      amount = await rwd.balanceOf(customer);
      expect(amount.toString()).to.equal(
        tokens("10"),
        "10 percent of 100 tokens staked"
      );

      /* unstaking */
      await decentralBank.unstakeTokens({ from: customer });

      amount = await tether.balanceOf(customer);
      expect(amount.toString()).to.equal(
        tokens("100"),
        "customer gets 100 Tether tokens back from unstacking"
      );

      amount = await tether.balanceOf(decentralBank.address);
      expect(amount.toString()).to.equal(
        tokens("0"),
        "bank should have 0 Tether after customer unstacked"
      );

      status = await decentralBank.isStaking(customer);
      expect(status).to.equal(false, "customer is no longer stacking");
    });
  });
});
