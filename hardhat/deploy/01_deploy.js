const { network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("------------------------------------")
    console.log(`Deploying in ${network.name}`)
    const nftMarketplace = await deploy("NftMarketplace", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    console.log("Deployed at: " + nftMarketplace.address)
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY &&
        process.env.MUMBAI_API_KEY &&
        process.env.BSCSCAN_API_KEY
    ) {
        await verify(lottery.address, args)
    }
    log("------------------------------------")
}

module.exports.tags = ["all", "nftmarketplace"]
