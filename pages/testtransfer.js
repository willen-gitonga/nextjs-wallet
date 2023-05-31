import { useState } from "react";
import { ethers } from "ethers";
import ContractABI from '../ContractABI.json'
import { Sepolia } from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";

const contractAddress = "0x8F3430b9ECeC52801611E5C13bB4477f90581f84";
const CONTRACT_ABI = ContractABI;
const sdk = new ThirdwebSDK(Sepolia);
export default function TokenTransfer() {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState(0);

  const handleTransfer = async () => {
    try {
      // Connect to the user's wallet using Web3
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(accounts[0]);
      const sdkWithSigner = ThirdwebSDK.fromSigner(signer);

     

      if (amount === 0) {
        console.error("Amount is not defined.");
        return;
      }
      const contract = await sdkWithSigner.getContract(contractAddress);
      // Execute the transfer function
      await contract.erc20.transfer(toAddress, amount);

      // Reset the input fields
    

      // Display a success message to the user
      alert('Tokens transferred successfully!');
    } catch (error) {
      console.error('Error transferring tokens:', error);
      alert('Error transferring tokens. Please try again.');
    }
  };

  return (
    <div>
      <h2>Token Transfer</h2>
     
        <div>
          <label htmlFor="toAddress">To Address:</label>
          <input type="text" id="toAddress" value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
        </div>
        <button onClick={handleTransfer}>Transfer Tokens</button>
    </div>
  );
}
