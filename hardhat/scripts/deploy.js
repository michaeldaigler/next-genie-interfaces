const hre = require("hardhat");
const fs = require('fs');
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");


  const LampToken = await hre.ethers.getContractFactory("LampToken");
  const lampToken = await LampToken.deploy("Lamp Token", "LAMP");

  const Marketplace = await hre.ethers.getContractFactory("CurateMarketplace");
  const marketplace = await Marketplace.deploy();

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(marketplace.address);



  await lampToken.deployed();
  await marketplace.deployed();
  await nft.deployed();


  let config = `
  export const nftmarketaddress = "${marketplace.address}"
  export const nftaddress = "${nft.address}"
  `

  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))

  console.log("Token deployed to:", lampToken.address);
  console.log("CuRATE Marketpalce deployed to: ", marketplace.address);
  console.log("NFT address: ", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
