import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer, ifeomaWallet] = await hre.ethers.getSigners();

  console.log("Deploying PraiseBoard with deployer account:", deployer.address);
  console.log("Ifeoma's beneficiary wallet address:", ifeomaWallet ? ifeomaWallet.address : deployer.address);

  const beneficiary = ifeomaWallet ? ifeomaWallet.address : deployer.address;
  const PraiseBoard = await hre.ethers.getContractFactory("PraiseBoard");
  const praiseBoard = await PraiseBoard.deploy(beneficiary);

  await praiseBoard.waitForDeployment();

  const contractAddress = await praiseBoard.getAddress();
  console.log("PraiseBoard deployed to:", contractAddress);

  // Export deployment info for frontend
  const deploymentInfo = {
    address: contractAddress,
    beneficiary: beneficiary,
    network: hre.network.name,
    chainId: hre.network.config.chainId || 31337,
  };

  const exportPath = path.resolve("./src/contracts/deployment.json");
  fs.mkdirSync(path.dirname(exportPath), { recursive: true });
  fs.writeFileSync(exportPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("Deployment info exported to src/contracts/deployment.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
