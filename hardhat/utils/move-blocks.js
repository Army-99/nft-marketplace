const { network } = require("hardhat")

const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
}

//in local blockchain we can mine
const moveBlocks = async(amount, sleepAmount=0) => {
    console.log("Moving blocks..")
    for(let k=0; k<amount;k++){
        await network.provider.request({
            method: "evm_mine",
            params: []
        })
        if(sleepAmount){
            console.log("Sleeping for "+ sleepAmount);
            await sleep(sleepAmount)
        }
    }
}

module.exports = {moveBlocks};