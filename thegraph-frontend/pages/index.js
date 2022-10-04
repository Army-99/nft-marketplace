const { useMoralisQuery, useMoralis } = require("react-moralis");
import NftBox from "../components/NftBox";

const Home = () => {
  /*const {
    data: activeNfts,
    isFetching: fetchingActiveNftsItem,
    isLoading: loadingActiveNfts,
    error: errorActiveNfts,
  } = useMoralisQuery("ActiveNfts", (query) =>
    query.limit(10).descending("tokenId")
  );*/
  
  const { isWeb3Enabled } = useMoralis();

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-3xl py-4 px-4">Recently Added</h1>
      <div className="flex flex-wrap gap-10">
        {isWeb3Enabled ? (
          fetchingActiveNftsItem ? (
            <div>Loading....</div>
          ) : (
            activeNfts.map((nft, key) => {
              return <NftBox nft={nft.attributes} key={key} />;
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
