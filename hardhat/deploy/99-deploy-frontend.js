require ("dotenv").config()
const { ethers, network } = require("hardhat");
const fs = require("fs");

const FRONTEND_PATH_ADDRESSES="../moralis-frontend/constants/contractAddresses.json";
const FRONTEND_PATH_ABI="../moralis-frontend/constants/abi.json";

module.exports = async function () {
    if(process.env.UPDATE_FRONTEND){
        console.log("Updating frontend!")
        await updateContractAddresses();
        await updateAbiMarketplace();
        console.log("Frontend Done!");
    }
}

const updateContractAddresses = async() => {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const chainId = network.config.chainId.toString();
    const currentAddresses = JSON.parse(fs.readFileSync(FRONTEND_PATH_ADDRESSES, "utf8"));
    if(chainId in currentAddresses){
        if(!currentAddresses[chainId]["NftMarketplace"].includes(nftMarketplace.address))
        {
            currentAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address);
        }
    }
    else{
        currentAddresses[chainId]= { NftMarketplace: [nftMarketplace.address] };
    }
    fs.writeFileSync(FRONTEND_PATH_ADDRESSES, JSON.stringify(currentAddresses));

}

const updateAbiMarketplace = async() => {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    fs.writeFileSync(FRONTEND_PATH_ABI, nftMarketplace.interface.format(ethers.utils.FormatTypes.json));
}


module.exports.tags = ["all", "frontend"];