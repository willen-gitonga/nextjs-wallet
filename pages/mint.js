import { useState } from "react";
import { ethers } from "ethers";
import ContractABI from '../ContractABI.json'
import { sepolia } from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";

const sdk = new ThirdwebSDK("sepolia");

const contractAddress = "0x8F3430b9ECeC52801611E5C13bB4477f90581f84";


function MintToken() {
  const [amount, setAmount] = useState("");

  async function handleMint() {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(accounts[0]);
      const sdkWithSigner = ThirdwebSDK.fromSigner(signer);

     

      if (amount === undefined) {
        console.error("Amount is not defined.");
        return;
      }

      const contract = await sdkWithSigner.getContract(contractAddress);
      console.log(contract);
      await contract.erc20.mint(amount);
      // const receipt = await tx.wait();
      // console.log(receipt);

    } catch (error) {
        console.error(error);
    }
  }

  return (
    <div>
      <label>
        Amount:
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <button onClick={handleMint}>Deposit</button>
    </div>
  );
}

export default MintToken;
