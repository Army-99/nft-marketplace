const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const TOKEN_ID = 0

const buyNft = async () => {
    const MarketplaceContract = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNFT")
    const { price } = await MarketplaceContract.getNft(basicNft.address, TOKEN_ID)
    console.log(`The price is: ${price}`)

    console.log(`Buying a NFT in the marketplace address: ${MarketplaceContract.address}`)
    const txBuy = await MarketplaceContract.buyNft(basicNft.address, TOKEN_ID, { value: price })
    await txBuy.wait(1)
    console.log("Bought!")
    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

buyNft()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
