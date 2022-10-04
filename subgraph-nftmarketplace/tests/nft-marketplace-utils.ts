import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  NftAdd,
  NftRemove,
  Nftbuy
} from "../generated/NftMarketplace/NftMarketplace"

export function createNftAddEvent(
  sender: Address,
  nftAddress: Address,
  tokenId: BigInt,
  price: BigInt
): NftAdd {
  let nftAddEvent = changetype<NftAdd>(newMockEvent())

  nftAddEvent.parameters = new Array()

  nftAddEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  nftAddEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  nftAddEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  nftAddEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return nftAddEvent
}

export function createNftRemoveEvent(
  nftAddress: Address,
  tokenId: BigInt
): NftRemove {
  let nftRemoveEvent = changetype<NftRemove>(newMockEvent())

  nftRemoveEvent.parameters = new Array()

  nftRemoveEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  nftRemoveEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return nftRemoveEvent
}

export function createNftbuyEvent(
  sender: Address,
  nftAddress: Address,
  tokenId: BigInt,
  price: BigInt
): Nftbuy {
  let nftbuyEvent = changetype<Nftbuy>(newMockEvent())

  nftbuyEvent.parameters = new Array()

  nftbuyEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  nftbuyEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  nftbuyEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  nftbuyEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return nftbuyEvent
}
