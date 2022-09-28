//New table in moralis DB with active items

Moralis.Cloud.afterSave("NftAdd", async (req) => {
    const confirmed = req.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    if(confirmed){
        const ActiveNfts = Moralis.Object.extend("ActiveNfts")
        logger.info("Adding Active nft!")
        const activeNfts = new ActiveNfts();
        activeNfts.set("marketplaceAddress", req.object.get("address"))
        activeNfts.set("nftAddress", req.object.get("nftAddress"))
        activeNfts.set("price", req.object.get("price"))
        activeNfts.set("tokenId", req.object.get("tokenId"))
        activeNfts.set("seller", req.object.get("seller"))
        logger.info(`nftAddress: ${req.object.get("nftAddress")} tokenId: ${req.object.get("tokenId")} `)
        await activeNfts.save();
        logger.info("SAVED!")
    }
})


Moralis.Cloud.afterSave("NftRemove", async (req) => {
    const confirmed = req.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    if(confirmed){
        logger.info("Delete nft from active items!")
        const ActiveNfts = Moralis.Object.extend("ActiveNfts")
        const query = new Moralis.Query(ActiveNfts)
        query.equalTo("marketplaceAddress", req.object.get("address"))
        query.equalTo("nftAddress", req.object.get("nftAddress"))
        query.equalTo("tokenId", req.object.get("tokenId"))
        logger.info(`Marketplace Query: ${query}`)
        const deletedNft = await query.first()
        logger.info(`Marketplace | deleted item: ${deletedNft}`)
        if(deletedNft){
            logger.info(`Deleting ${req.object.get("tokenId")} at address ${req.object.get("nftAddress")}`)
            await deletedNft.destroy()
        }else{
            logger.info(`No nft found!`)
        }
    }
})
/*TODO
Moralis.Cloud.afterSave("NftBuy", async (req) => {
    const confirmed = req.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    if(confirmed){
        logger.info("Bought nft!")
        const ActiveNfts = Moralis.Object.extend("ActiveNfts")
        const query = new Moralis.Query(ActiveNfts)
        query.equalTo("marketplaceAddress", req.object.get("address"))
        query.equalTo("nftAddress", req.object.get("nftAddress"))
        query.equalTo("tokenId", req.object.get("tokenId"))
        logger.info(`Marketplace Query: ${query}`)
        const deletedNft = await query.first()
        logger.info(`Marketplace | deleted item: ${deletedNft}`)
        if(deletedNft){
            logger.info(`Deleting from Active Nfts Token ID: ${req.object.get("tokenId")} at address ${req.object.get("nftAddress")}`)
            await deletedNft.destroy()
        }else{
            logger.info(`No nft found!`)
        }
    }
})*/