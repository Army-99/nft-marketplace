const { ethers, network } = require("hardhat")
const {moveBlocks} = require("../utils/move-blocks");

const TOKEN_ID=4

const cancelNft = async() => {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNFT")

    console.log(`Deleting NFT in the marketplace address: ${nftMarketplace.address}` )
    const txAdd = await nftMarketplace.removeNft(basicNft.address, TOKEN_ID)
    await txAdd.wait(1)
    console.log("Deleted!")
    if(network.config.chainId == "31337"){
        await moveBlocks(2, (sleepAmount = 1000));
    }
    
}

cancelNft()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })