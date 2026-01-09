const Donation = artifacts.require("Donation");
contract("Donation", (accounts) => {
  let donationInstance;
  beforeEach(async () => {
    donationInstance = await Donation.deployed();
  });

  it("should deploy the contract correctly", async () => {
    assert(donationInstance.address !== "", "Contract should have an address.");
  });

  it("should have the correct owner", async () => {
    const owner = await donationInstance.owner();
    assert.equal(owner, accounts[0], "The owner is not the first account.");
  });

  it("should allow a user to make a donation", async () => {
    const donor = accounts[1]; 
    const donationAmount = web3.utils.toWei("1", "ether"); 
   
    await donationInstance.donate({ from: donor, value: donationAmount });

    
    const contractBalance = await web3.eth.getBalance(donationInstance.address);
    assert.equal(contractBalance, donationAmount, "The contract balance is incorrect.");

    const donorBalance = await donationInstance.donors(donor);
    assert.equal(donorBalance.toString(), donationAmount, "The donor's balance was not recorded correctly.");
  });

});
