import { Form, useNotification, Button } from "web3uikit";
import { ethers } from "ethers";
import NftMarketplaceABI from "../constants/NftMarketplace.json";
import BasicNftABI from "../constants/BasicNft.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import contractAddresses from "../constants/contractAddresses.json";

const sellnft = () => {
  const { chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "5";
  const marketplaceAddress = contractAddresses[chainString].NftMarketplace[0];
  const dispatch = useNotification();

  const { runContractFunction } = useWeb3Contract({});

  const HandleAddNft = async (data) => {
    console.log("Approving..");

    if(data.data[0].inputResult == "" || data.data[1].inputResult=="" || data.data[2].inputResult=="")
    {
      HandleMissingParameters()
      return;
    }

    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils
      .parseEther(data.data[2].inputResult, "ether")
      .toString();

    

    const approveOptions = {
      abi: BasicNftABI,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: marketplaceAddress,
        tokenId: tokenId,
      },
    };

    await runContractFunction({
      params: approveOptions,
      onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
      onError: (err) => {
        console.error(err);
      },
    });
  };

  const handleApproveSuccess = async (nftAddress, tokenId, price) => {
    console.log("NFT Approved!");
    console.log(marketplaceAddress);

    const listOptions = {
      abi: NftMarketplaceABI,
      contractAddress: marketplaceAddress,
      functionName: "addNft",
      params: {
        nftAddress: nftAddress,
        price: price,
        tokenId: tokenId,
      },
    };

    await runContractFunction({
      params: listOptions,
      onSuccess: HandleSuccess,
      onError: (err) => {
        console.error(err);
      },
    });

  };

  const HandleSuccess = async (tx) => {
    await tx.wait(1);

    dispatch({
      type: "success",
      message: "Nft added ",
      title: "Nft Added",
      position: "topR",
    });
  };

  const HandleMissingParameters = async () => {
    dispatch({
      type: "error",
      message: "Missing Parameters",
      title: "Missing Parameters",
      position: "topR",
    });
  };

  return (
    <div>
      <Form
      
        onSubmit={HandleAddNft}
        customFooter={<Button type="submit" text="Submit" />} //Submit button will be disabled after 1 click
        data={[
          {
            name: "NFT Address",
            type: "text",
            inputWidth: "50%",
            value: "",
            key: "nftAddress",
          },
          {
            name: "Token ID",
            type: "number",
            inputWidth: "50%",
            value: "",
            key: "tokenId",
          },
          {
            name: "Price (ETH)",
            type: "number",
            inputWidth: "50%",
            value: "",
            key: "price",
          },
        ]}
        title="Sell NFT"
        id="Main Form"
      />
    </div>
  );
};

export default sellnft;
