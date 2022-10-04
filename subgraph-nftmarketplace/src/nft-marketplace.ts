import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  NftAdd as NftAddEvent,
  NftRemove as NftRemoveEvent,
  Nftbuy as NftBuyEvent,
  Nftbuy
} from "../generated/NftMarketplace/NftMarketplace"
import { NftAdd, NftBuy, ActiveNft, NftRemove } from '../generated/schema'


export function handleNftbuy(event: NftBuyEvent): void {
  let nftBuy = NftBuy.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeNft = ActiveNft.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  if(!nftBuy){
    nftBuy = new NftBuy(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
    nftBuy.buyer = event.params.sender
    nftBuy.nftAddress = event.params.nftAddress
    nftBuy.tokenId = event.params.tokenId
    activeNft!.buyer = event.params.sender

    nftBuy.save()
    activeNft!.save()
  }
}

export function handleNftRemove(event: NftRemoveEvent): void {
  let nftRemove = NftRemove.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeNft = ActiveNft.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  if(!nftRemove){
    nftRemove = new NftRemove(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
    
  }
  nftRemove.nftAddress = event.params.nftAddress
  nftRemove.tokenId = event.params.tokenId

  activeNft!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD")

  nftRemove.save()
  activeNft!.save()
}

export function handleNftAdd(event: NftAddEvent): void {
  let nftAdd = NftAdd.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeNft = ActiveNft.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  if(!nftAdd){
    nftAdd = new NftAdd(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
    
  }
  if(!activeNft){
    activeNft = new ActiveNft(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  }
  
  nftAdd.seller = event.params.sender
  activeNft.seller = event.params.sender

  nftAdd.nftAddress = event.params.nftAddress
  activeNft.nftAddress = event.params.nftAddress

  nftAdd.tokenId = event.params.tokenId
  activeNft.tokenId = event.params.tokenId

  nftAdd.price = event.params.price
  activeNft.price = event.params.price

  activeNft.buyer = Address.fromString("0x0000000000000000000000000000000000000000")

  nftAdd.save()
  activeNft.save()
}

const getIdFromEventParams = (tokenId: BigInt, nftAddress: Address):string => {
  return tokenId.toHexString() + nftAddress.toHexString()
}