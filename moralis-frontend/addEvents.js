const Moralis = require("moralis-v1/node")
require ("dotenv").config()
const contractAddresses = require ('./constants/contractAddresses.json')
const abi = require ('./constants/abi')

const chainId = process.env.chainId || 31337 
let moralisChainId = chainId == "31337" ? "1337" : chainId
const contractAddress = contractAddresses[chainId]["NftMarketplace"][0]

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const masterKey = process.env.masterKey;

const main = async() => {
    await Moralis.start({ serverUrl, appId, masterKey });
    console.log(`Working with contract address ${contractAddress}`)

    const nftAddOptions = {
        chainId: moralisChainId,
        sync_historical: true,
        address: contractAddress,
        topic: "NftAdd(address,address,uint,uint)",
        abi:{
                "anonymous": false,
                "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "nftAddress",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
                ],
                "name": "NftAdd",
                "type": "event"
            },
            tableName: "NftAdd"
      };

    const nftBuyOptions = {
        chainId: moralisChainId,
        sync_historical: true,
        address: contractAddress,
        topic: "Nftbuy(address,address,uint,uint)",
        abi:{
                "anonymous": false,
                "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "nftAddress",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
                ],
                "name": "Nftbuy",
                "type": "event"
            },
            tableName: "NftBuy"
      };

    const nftRemoveOptions = {
        chainId: moralisChainId,
        sync_historical: true,
        address: contractAddress,
        topic: "NftRemove(address,uint)",
        abi:{
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "nftAddress",
                "type": "address"
              },
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              }
            ],
            "name": "NftRemove",
            "type": "event"
          },
            tableName: "NftRemove"
      };
      
    const addResponse = await Moralis.Cloud.run("watchContractEvent", nftAddOptions, { useMasterKey: true });
    const buyResponse = await Moralis.Cloud.run("watchContractEvent", nftBuyOptions, { useMasterKey: true });
    const removeResponse = await Moralis.Cloud.run("watchContractEvent", nftRemoveOptions, { useMasterKey: true });

    if(addResponse.success && buyResponse.success && removeResponse.success){
        console.log("Events wrote in the DB!")
    }else{
        console.error("Something went wrong!")
    }
}

main()
.then(() => process.exit(0))
.catch((err) => {
    console.error(err);
    process.exit(1);
})

