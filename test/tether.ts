import { expect } from "chai";
import { TetherContract, TetherInstance } from "../types/truffle-contracts";

const Tether: TetherContract = artifacts.require("Tether");

contract(
  "Tether",
  /* #03-01 */ ([bank, Steven, Arlo]) => {
    let tether: TetherInstance;

    /*
    - our coin to token conversion is actually the same
      as ether to wei
    - so we can utilize the tool built-in in web3
      that convert ether to wei to convert our
      number Tether coins to its corresponding 
      tokens  
  */
    function tokens(number: string) {
      return web3.utils.toWei(number, "ether");
    }

    before(async () => {
      tether = await Tether.new();
    });

    describe("Mock Tether Deployment", async () => {
      it("matches name", async () => {
        const name = await tether.name();
        expect(name).to.equal("Mock Tether Token");
      });

      it("checks bank has the total supply initially", async () => {
        const total = await tether.balanceOf(bank);
        /* owner should have 1 million Tethers */
        expect(total.toString()).to.equal(tokens("1000000"));
      });

      it("transfers 100 Tether from the bank to the customer successfully", async () => {
        /*  
        - transfer by default is from the owner;
        - you can override 'from' address using transaction details 
          in the tests     
      */
        await tether.transfer(
          Steven,
          tokens("100"),
          /* #03-02 */ { from: bank }
        );
        const balance = await tether.balanceOf(Steven);
        expect(balance.toString()).to.equal(tokens("100"));
      });

      it("transfers 100 Tether to a third party by the bank successfully", async () => {
        await tether.transfer(Steven, tokens("1000"));
        /* allow bank to transfer up to 100 Tether */
        await tether.approve(bank, tokens("100"), { from: Steven });
        /* bank performs the transfer on behalf of the customer */
        await tether.transferFrom(Steven, Arlo, tokens("100"), { from: bank });
        const balance = await tether.balanceOf(Arlo);
        expect(balance.toString()).to.equal(tokens("100"));
      });

      it("expects to throw as the bank transfers more than the allowed amount to a third party", async () => {
        await tether.transfer(Steven, tokens("1000"));
        /* allow bank to transfer up to 100 Tether */
        await tether.approve(bank, tokens("100"), { from: Steven });
        /* 
        - bank performs the transfer on behalf of the customer 
        - exceeds the allowed amount
      */
        try {
          await tether.transferFrom(Steven, Arlo, tokens("200"), {
            from: bank,
          });
        } catch (err: any) {
          expect(err.reason).to.equal(
            "transferred amount greater than allowed amount"
          );
        }
      });
    });
  }
);
