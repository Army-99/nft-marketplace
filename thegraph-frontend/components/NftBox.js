import { useEffect, useState } from "react";
import Image from "next/image";
import { useWeb3Contract, useMoralis } from "react-moralis";
import NftMarketplaceABI from "../constants/NftMarketplace.json";
import BasicNftABI from "../constants/BasicNft.json";
import { Card } from "web3uikit";
import { ethers } from "ethers";
import UpdateNftModal from "./UpdateNftModal";
import { useNotification } from "web3uikit";

const truncateString = (str, strLen) => {
  if (str.length > strLen) {
    const separator = "...";
    const sepLength = separator.length;
    const charsToShow = strLen - sepLength;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return (
      str.substring(0, frontChars) +
      separator +
      str.substring(str.length - backChars)
    );
  }
};

const NftBox = ({ nft, marketplaceAddress }) => {
  const { price, nftAddress, tokenId, seller } = nft;
  const { isWeb3Enabled, account } = useMoralis();
  const [imgURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useNotification();

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: BasicNftABI,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  const { runContractFunction: buyNft } = useWeb3Contract({
    abi: NftMarketplaceABI,
    contractAddress: marketplaceAddress,
    functionName: "buyNft",
    params: {
      tokenId: tokenId,
      nftAddress: nftAddress,
    },
    msgValue: price,
  });

  const updateUI = async () => {
    const tokenURI = await getTokenURI();
    console.log("TOKEN URI: " + tokenURI)
    if (tokenURI) {
      //Use IPFS Gateway
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const response = await (await fetch(requestURL)).json();
      const image = response.image;
      console.log(image)
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

  const isOwner = seller === account;
  const formattedSeller = isOwner ? "You" : truncateString(seller, 15);

  const HandleNftClick = () => {
    isOwner
      ? setShowModal(true)
      : buyNft({
          onError: (err) => {
            console.error(err);
          },
          onSuccess: handleSuccessBought,
        });
  };

  const handleSuccessBought = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Nft Bought ",
      title: "Nft bought",
      position: "topR",
    });
  };

  const hideModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {imgURI ? (
        <div>
          <UpdateNftModal
            isVisible={showModal}
            tokenId={tokenId}
            nftAddress={nftAddress}
            marketplaceAddress={marketplaceAddress}
            onClose={hideModal}
          ></UpdateNftModal>
          <Card
            title={tokenName}
            description={tokenDescription}
            onClick={HandleNftClick}
          >
            <div className="flex flex-col items-end p-2">
              <div>#{tokenId}</div>
              <div>Owned by {formattedSeller}</div>
              <Image
                loader={() => imgURI}
                src={imgURI}
                alt="Picture of the author"
                width={200}
                height={200}
              ></Image>
              <div className="font-bold">
                Price: {ethers.utils.formatEther(price)} ETH
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div>Loading..</div>
      )}
    </div>
  );
};

export default NftBox;
