// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NftMarketplace__PriceMustBePositive();
error NftMarketPlace__NotApproved();
error NftMarketplace__AlreadyListed(address nftAddress, uint tokenId);
error NftMarketplace__NotNftOwner();
error NftMarketplace__NotListed(address nftAddress,uint tokenId);
error NftMarketplace__PriceNotMet(address nftAddress, uint tokenId, uint price);
error NftMarketplace__NoProceedes();
error NftMarketplace__TransferFailed();

contract NftMarketplace is ReentrancyGuard{
    struct Listing{
        uint price;
        address seller;
    }

    /**EVENTS */
    event NftAdd(address indexed sender, address indexed nftAddress, uint indexed tokenId, uint price); //When NFT is listed
    event Nftbuy(address indexed sender, address indexed nftAddress, uint indexed tokenId, uint price); //When a NFT is sold
    event NftRemove(address indexed nftAddress, uint indexed tokenId);


    /** TYPES */
    mapping (address => mapping(uint => Listing)) private s_listings;   //NFT address -> Nft TokenId -> Listing 
    mapping(address => uint) private s_proceeds;    //Seller proceeds

    /**MODIFIERS */
    modifier NotListed(address nftAddress, uint tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if(listing.price > 0){revert NftMarketplace__AlreadyListed(nftAddress, tokenId);}
        _;
    }

    modifier isOwner(address nftAddress, uint tokenId, address spender){
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if(spender != owner){ revert NftMarketplace__NotNftOwner();}
        _;
    }

    modifier isListed(address nftAddress, uint tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if(listing.price <= 0){revert NftMarketplace__NotListed(nftAddress, tokenId);}
        _;
    }

    /** MAIN FUNCTIONS */
    /**
        @notice Method for add a nft on the marketplace
        @param nftAddress: address of the nft
        @param price: price of the nft
        @param tokenId: token of the nft
     */
    function addNft(
        address nftAddress
        ,uint price
        ,uint tokenId
        ) external
            NotListed(nftAddress, tokenId) 
            isOwner(nftAddress, tokenId, msg.sender)
        {
            if(price<=0){revert NftMarketplace__PriceMustBePositive();}
            //Check validity
            IERC721 nft = IERC721(nftAddress);
            if(nft.getApproved(tokenId) != address(this)){revert NftMarketPlace__NotApproved();}
            s_listings[nftAddress][tokenId] = Listing (price, msg.sender);
            emit NftAdd(msg.sender, nftAddress, tokenId, price);
    }

    /**
        @notice Method for buy a NFT listed
        @param nftAddress: address of the nft
        @param tokenId: token of the nft
     */
    function buyNft(
        address nftAddress
        ,uint tokenId
        ) external payable 
        isListed(nftAddress, tokenId) 
        nonReentrant
        {
            Listing memory listedItem = s_listings[nftAddress][tokenId];
            if(msg.value < listedItem.price) { revert NftMarketplace__PriceNotMet(nftAddress,tokenId, listedItem.price);}

            s_proceeds[nftAddress]+=msg.value;
            delete (s_listings[nftAddress][tokenId]);
            IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);

            emit Nftbuy(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    /**
        @notice Method for remove a NFT listed
        @param nftAddress: address of the nft
        @param tokenId: token of the nft
     */
    function removeNft(
        address nftAddress
        ,uint tokenId
        ) external 
        isListed(nftAddress, tokenId)
        {
        delete (s_listings[nftAddress][tokenId]);
        emit NftRemove(nftAddress, tokenId);
    }

    /**
        @notice Method for update the price of a NFT listed
        @param nftAddress: address of the nft
        @param tokenId: token of the nft
        @param newPrice: token of the nft
     */
    function updateNft(
        address nftAddress        
        ,uint tokenId
        ,uint newPrice
        ) external
            isListed(nftAddress, tokenId)
            isOwner(nftAddress, tokenId, msg.sender)
        {
            s_listings[nftAddress][tokenId].price = newPrice;
            emit NftAdd(msg.sender,nftAddress, tokenId, newPrice);
    }

    /**
        @notice Method for withdraw 
     */
    function withdrawProceeds() external nonReentrant{
        uint proceeds = s_proceeds[msg.sender];
        if(proceeds <= 0) {revert NftMarketplace__NoProceedes();}
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if(!success){ revert NftMarketplace__TransferFailed();}
    }

    /* VIEWS */
    function getNft(
        address nftAddress
        ,uint tokenId
        ) external view returns(Listing memory){

            return s_listings[nftAddress][tokenId];
    }

    function getProceeds(
        address seller
        ) external view returns(uint){
            return s_proceeds[seller];
    }
        
}

