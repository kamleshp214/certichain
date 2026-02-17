const hre = require("hardhat");

async function main() {
  console.log("Deploying CertificateRegistry contract...");

  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  const registry = await CertificateRegistry.deploy();

  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("CertificateRegistry deployed to:", address);
  console.log("\nAdd this to your .env.local file:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
