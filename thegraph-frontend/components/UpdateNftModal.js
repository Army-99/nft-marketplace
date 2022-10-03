import { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import NftMarketplaceABI from "../constants/NftMarketplace.json";
import { ethers } from "ethers";

const UpdateNftModal = ({
  nftAddress,
  tokenId,
  isVisible,
  marketplaceAddress,
  onClose,
}) => {
  const [price, setPrice] = useState(0);
  const dispatch = useNotification();

  const { runContractFunction: updateNft } = useWeb3Contract({
    abi: NftMarketplaceABI,
    contractAddress: marketplaceAddress,
    functionName: "updateNft",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      newPrice: ethers.utils.parseEther(price || "0"),
    },
  });

  const HandleSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Nft updated ",
      title: "Nft Updated",
      position: "topR",
    });
    onClose && onClose();
    setPrice("0");
  };

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() => {
        updateNft({
          onError: (error) => {
            console.error(error);
          },
          onSuccess: HandleSuccess,
        });
      }}
    >
      <Input
        label="Update nft price"
        name="New Nft Price"
        type="number"
        onChange={(event) => {
          setPrice(event.target.value);
        }}
      ></Input>
    </Modal>
  );
};

export default UpdateNftModal;
