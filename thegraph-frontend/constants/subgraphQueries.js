import { gql } from "@apollo/client";

const GET_ACTIVE_NFTS = gql`
    {
    activeNfts(first: 5, where: {buyer : "0x0000000000000000000000000000000000000000"}) {
      id
      buyer
      seller
      nftAddress
      price
      tokenId
    }
  }
`

export default GET_ACTIVE_NFTS