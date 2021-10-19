const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');

const Election = artifacts.require('Election');

contract('Election', ([deployer, secondAccount]) => {
  var ElectionInstance;

  before(async () => {
    ElectionInstance = await Election.deployed();
  });

  describe('Check deploy', async () => {
    it('Check contract deployed', async () => {
      assert(
        ElectionInstance.address != '' && ElectionInstance.address != null
      );
    });
    it('totalVotes', async () => {
      var totalVotes = await ElectionInstance.totalVotes();
      assert.equal(totalVotes, 0, 'total votes at begin');
    });
  });

  describe('Check interaction', async () => {
    it('vote for candidate', async () => {
      await ElectionInstance.voteForCandidate(
        '0xAEdd1eb79EBcf76D4dBad06e9F6dda739c7257bb',
        { from: deployer, value: web3.utils.toWei('1', 'ether') }
      );
    });
    it('total votes', async () => {
      var totalVotes = await ElectionInstance.totalVotes();
      assert.equal(totalVotes, 1, 'total votes');
    });
  });

  describe('Revert transaction', async () => {
    it('revert vote for no money', async () => {
      await truffleAssert.reverts(
        ElectionInstance.voteForCandidate(
          '0xAEdd1eb79EBcf76D4dBad06e9F6dda739c7257bb',
          { from: secondAccount }
        )
      );
    });
    it('revert vote for invalid address to vote', async () => {
      await truffleAssert.reverts(
        ElectionInstance.voteForCandidate(secondAccount, {
          from: secondAccount,
          value: web3.utils.toWei('1', 'ether'),
        })
      );
    });
  });
});
