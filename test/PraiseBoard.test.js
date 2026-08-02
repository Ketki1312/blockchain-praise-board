import { expect } from "chai";
import hre from "hardhat";

describe("PraiseBoard", function () {
  let praiseBoard;
  let deployer;
  let ifeoma;
  let commuter1;
  let commuter2;

  beforeEach(async function () {
    [deployer, ifeoma, commuter1, commuter2] = await hre.ethers.getSigners();
    const PraiseBoard = await hre.ethers.getContractFactory("PraiseBoard");
    praiseBoard = await PraiseBoard.deploy(ifeoma.address);
    await praiseBoard.waitForDeployment();
  });

  it("Should set the correct owner/beneficiary", async function () {
    expect(await praiseBoard.owner()).to.equal(ifeoma.address);
  });

  it("Should record tips and transfer funds directly to owner", async function () {
    const tipAmount = hre.ethers.parseEther("0.01");
    const initialIfeomaBalance = await hre.ethers.provider.getBalance(ifeoma.address);

    const tx = await praiseBoard.connect(commuter1).sendTip("Kwame B.", "Thanks for keeping route 42 accurate!", {
      value: tipAmount,
    });
    await tx.wait();

    const finalIfeomaBalance = await hre.ethers.provider.getBalance(ifeoma.address);
    expect(finalIfeomaBalance - initialIfeomaBalance).to.equal(tipAmount);

    const tips = await praiseBoard.getAllTips();
    expect(tips.length).to.equal(1);
    expect(tips[0].name).to.equal("Kwame B.");
    expect(tips[0].message).to.equal("Thanks for keeping route 42 accurate!");
    expect(tips[0].amount).to.equal(tipAmount);
    expect(tips[0].sender).to.equal(commuter1.address);
  });

  it("Should emit NewTip event when a tip is sent", async function () {
    const tipAmount = hre.ethers.parseEther("0.005");
    await expect(praiseBoard.connect(commuter2).sendTip("Nneka O.", "You saved my morning commute!", { value: tipAmount }))
      .to.emit(praiseBoard, "NewTip")
      .withArgs(commuter2.address, "Nneka O.", "You saved my morning commute!", tipAmount, (val) => val > 0);
  });

  it("Should revert if tip amount is zero", async function () {
    await expect(praiseBoard.connect(commuter1).sendTip("Tester", "No ETH", { value: 0 }))
      .to.be.revertedWithCustomError(praiseBoard, "InvalidTipAmount");
  });
});
