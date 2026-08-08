import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer, ifeomaWallet] = await hre.ethers.getSigners();

  console.log("Deploying PraiseBoard contract with deployer account:", deployer.address);

  // Determine beneficiary address (Ifeoma's wallet)
  const beneficiary = process.env.BENEFICIARY_ADDRESS || (ifeomaWallet ? ifeomaWallet.address : deployer.address);
  console.log("Beneficiary wallet address:", beneficiary);

  const PraiseBoard = await hre.ethers.getContractFactory("PraiseBoard");
  const praiseBoard = await PraiseBoard.deploy(beneficiary);

  await praiseBoard.waitForDeployment();

  const contractAddress = await praiseBoard.getAddress();
  console.log("PraiseBoard deployed to:", contractAddress);

  // Export deployment artifact info for frontend
  const deploymentInfo = {
    address: contractAddress,
    beneficiary: beneficiary,
    network: hre.network.name,
    chainId: hre.network.config.chainId || 31337,
  };

  const exportPath = path.resolve("./src/contracts/deployment.json");
  fs.mkdirSync(path.dirname(exportPath), { recursive: true });
  fs.writeFileSync(exportPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("Deployment artifact written to src/contracts/deployment.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
