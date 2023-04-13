const { ethers } = require('hardhat');
const { expect } = require('chai');

let deployer, user, attacker;
describe('Frontrunning', function () {
  before(async function () {
    [deployer, user, attacker] = await ethers.getSigners();
    this.attackerInitialBalance = await ethers.provider.getBalance(
      attacker.address,
    );

    const deploymentContract = await ethers.getContractFactory("Frontrunning",deployer);
    this.deployment = await deploymentContract.deploy();
  });

  it('Should not be able to deploy', async function () {

    // Get mempool's trancasctions
    const txs = await ethers.provider.send('eth_getBlockByNumber', [
      'pending',
      true,
    ]);
    // Find the tx that starts with this data
    const tx = txs.transactions.find(
      //somehow the transaction from the mempool should be found here 
      //(tx) => tx.data.slice(0, 10) === '0x60803d60'
    );

    // Send the same tx with more gas
    await attacker.sendTransaction({
      to: tx.to,
      data: tx.input,
      gasPrice: ethers.BigNumber.from(tx.gasPrice).add(1),
      gasLimit: tx.gas,
    });
  });

  after(async function () {
    // Mine all the transactions
    await ethers.provider.send('evm_mine', []);

    //the conditions should be checked here 
  });
});
