const Election = artifacts.require('Election');

module.exports = function (deployer) {
  deployer.deploy(
    Election,
    [
      '0xc3f6Ca796101AF3be8a9517d53BE25869f303C15',
      '0xAEdd1eb79EBcf76D4dBad06e9F6dda739c7257bb',
      '0x90A778f080a9120deC322B89eFDaA72E1Bedc6dc',
    ],
    10
  );
};
