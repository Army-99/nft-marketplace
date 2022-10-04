const { useMoralisQuery, useMoralis } = require("react-moralis");
import NftBox from "../components/NftBox";
import contractAddresses from "../constants/contractAddresses.json";
import { useQuery } from "@apollo/client"
import GET_ACTIVE_NFTS from "../constants/subgraphQueries";

const Home = () => {
  const { isWeb3Enabled, chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "5";
  const marketplaceAddress = contractAddresses[chainString].NftMarketplace[0];
  
  const { loading, error, data: activeNfts} = useQuery(GET_ACTIVE_NFTS)

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-3xl py-4 px-4">Recently Added</h1>
      <div className="flex flex-wrap gap-10">
        {isWeb3Enabled ? (
          loading ? (
            <div>Loading....</div>
          ) : (
            activeNfts.activeNfts.map((nft, key) => {
              return <NftBox nft={nft} key={key} marketplaceAddress={marketplaceAddress}/>;
            })
          )
        ) : (
          <div>You're not connected!</div>
        )}
      </div>
    </div>
  );
};

export default Home;
