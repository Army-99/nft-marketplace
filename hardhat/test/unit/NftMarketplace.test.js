const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Nft Marketplace Unit Tests", function () {
          let nftMarketplace, basicNft, deployer, player
          const chainId = network.config.chainId
            const TOKEN_ID = 0;
            const PRICE = ethers.utils.parseEther("0.1")
            const newPrice = ethers.utils.parseEther("0.2")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              accounts = await ethers.getSigners();
              player = accounts[1]
              await deployments.fixture(["all"])
              nftMarketplace = await ethers.getContract("NftMarketplace")
              basicNft = await ethers.getContract("BasicNFT")
              await basicNft.mintNft();
              await basicNft.approve(nftMarketplace.address, TOKEN_ID)
              await nftMarketplace.addNft(basicNft.address, PRICE ,TOKEN_ID)
          })

            it("Add a nft and can be sold and the seller can withdraw", async function () {
                const playerConntectedNftMarketplace = nftMarketplace.connect(player)
                await playerConntectedNftMarketplace.buyNft(basicNft.address, TOKEN_ID, {value: PRICE})
                const newOwner = await basicNft.ownerOf(TOKEN_ID);
                const deployerProceeds = await nftMarketplace.getProceeds(deployer)
                assert(newOwner.toString() == player.address) //new Owner of NFT 
                assert(deployerProceeds.toString() == PRICE.toString()) //Update seller's balance

                //Seller can withdraw
                const txResponse = await nftMarketplace.withdrawProceeds()
                const transactionReceipt = await txResponse.wait(1)
                const { gasUsed, effectiveGasPrice } = transactionReceipt
                const gasCost = gasUsed.mul(effectiveGasPrice)
                
                deployerProceedsAfter = await nftMarketplace.getProceeds(deployer)
                assert(deployerProceedsAfter.toString() == "0")
            })

            it("Seller can update the price", async function () {
                await nftMarketplace.updateNft(basicNft.address, TOKEN_ID, newPrice)
                const nft = await nftMarketplace.getNft(basicNft.address, TOKEN_ID)
                assert(nft.price.toString() == newPrice.toString())
            })

            it("Seller can remove nft", async function () {
                await nftMarketplace.removeNft(basicNft.address, TOKEN_ID)
                await expect(nftMarketplace.getNft(basicNft.address, TOKEN_ID)).to.be.revertedWith("NftMarketplace__NotListed");
            })

            it("Another account can't modify or remove the seller's nft", async function () {
                const playerConntectedNftMarketplace = nftMarketplace.connect(player)
                await expect(playerConntectedNftMarketplace.removeNft(basicNft.address, TOKEN_ID)).to.be.revertedWith("NftMarketplace__NotNftOwner")
                await expect(playerConntectedNftMarketplace.updateNft(basicNft.address, TOKEN_ID, newPrice)).to.be.revertedWith("NftMarketplace__NotNftOwner")
            })
    })

