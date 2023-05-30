import { useState } from "react";
import { ethers } from "ethers";
import ContractABI from '../ContractABI.json'
import { goerli } from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";

const sdk = new ThirdwebSDK("goerli");

const contractAddress = "0xe4DEd71eD42acEA60c6f41b9d1640706aa5d1c04";

function MintToken() {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  async function handleMint() {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(accounts[0]);
      const sdkWithSigner = ThirdwebSDK.fromSigner(signer);

      if (toAddress === undefined) {
        console.error("To Address is not defined.");
        return;
      }

      if (amount === undefined) {
        console.error("Amount is not defined.");
        return;
      }

      const contract = await sdkWithSigner.getContract(contractAddress);
      console.log(contract);

      const tx =  await contract.call("mintTo", [toAddress, amount]);
      const receipt = await tx.wait();
      console.log(receipt);

    } catch (error) {
        console.error(error);
    }
  }

  return (
    <div>
      <label>
        To Address:
        <input
          type="text"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
      </label>
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
