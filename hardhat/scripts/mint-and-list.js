const { ethers } = require("hardhat")

const PRICE = ethers.utils.parseEther("0.1")

const mintAndList = async() => {
    /** ERROR IT DOESN'T NEED TO DEPLOY EVERY TIME */
    //await deployments.fixture(["all"])
    const nftMarketplace = await ethers.getContract("NftMarketplace")

    const basicNft = await ethers.getContract("BasicNFT")
    
    console.log(`Minting NFT...`)
    const txMinting = await basicNft.mintNft();
    const txMintingReceipt = await txMinting.wait(1)
    const tokenId = txMintingReceipt.events[0].args.tokenId;

    console.log("Approving Nft..")
    const txApprove = await basicNft.approve(nftMarketplace.address, tokenId)
    await txApprove.wait(1)

    console.log(`Adding NFT in the marketplace address: ${nftMarketplace.address}` )
    const txAdd = await nftMarketplace.addNft(basicNft.address, PRICE ,tokenId)
    await txAdd.wait(1)
    console.log("Added!")
}

mintAndList()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })