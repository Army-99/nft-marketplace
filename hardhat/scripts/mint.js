const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.utils.parseEther("0.1")

const mint = async () => {
    const basicNft = await ethers.getContract("BasicNFT")

    console.log(`Minting NFT...`)
    const txMinting = await basicNft.mintNft()
    const txMintingReceipt = await txMinting.wait(1)
    const tokenId = txMintingReceipt.events[0].args.tokenId
    console.log(`TOKEN ID: ${tokenId}`)
    console.log(`Nft Address: ${basicNft.address}`)

    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

mint()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
