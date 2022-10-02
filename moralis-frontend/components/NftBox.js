import { useEffect, useState } from "react";
import Image from "next/image";
import { useWeb3Contract, useMoralis } from "react-moralis";
import NftMarketplaceABI from "../constants/NftMarketplace.json";
import BasicNftABI from "../constants/BasicNft.json";
import { Card } from "web3uikit";
import { ethers } from "ethers";

const NftBox = ({ nft }) => {
  const { marketplaceAddress, price, nftAddress, tokenId, seller } = nft;
  const { isWeb3Enabled, chainId } = useMoralis();
  const [imgURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: BasicNftABI,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  const updateUI = async () => {
    const tokenURI = await getTokenURI();
    if (tokenURI) {
      //Use IPFS Gateway
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const response = await (await fetch(requestURL)).json();
      const image = response.image;
      setImageURI(image);
      setTokenName(response.name);
      setTokenDescription(response.description);
    }
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      {imgURI ? (
        <Card title={tokenName} description={tokenDescription}>
          <div className="flex flex-col items-end gap-2 p-2">
            <div>#{tokenId}</div>
            <div>Owned by {seller}</div>
            <Image
              loader={() => imgURI}
              src={imgURI}
              alt="Picture of the author"
              width={50}
              height={50}
            ></Image>
            <div className="font-bold">
              Price: {ethers.utils.formatEther(price)}
            </div>
          </div>
        </Card>
      ) : (
        <div>Loading..</div>
      )}
    </div>
  );
};

export default NftBox;
