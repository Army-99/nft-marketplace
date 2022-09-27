//New table in moralis DB with active items

Moralis.Cloud.afterSave("NftAdd", async (req) => {
    const confirmed = req.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info("Looking for confirmed TX")
    if(confirmed){
        logger.info("Found nft!")
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