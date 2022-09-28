hardhat> yarn hardhat node -> To run the local hardhat chain 
moralis-frontend> yarn moralis:sync -> To connect moralis to local chain (you need to restart the sync on moralis)
moralis-frontend> yarn moralis:cloud -> To upload scripts on moralis cloud functions
hardhat> yarn hardhat run .\scripts\mint-and-add.js --network localhost -> Add a new nft on the local chain (For test event)
hardhat> yarn hardhat run .\scripts\cancelNft.js --network localhost -> Remove nft on the local chain (For test event)
