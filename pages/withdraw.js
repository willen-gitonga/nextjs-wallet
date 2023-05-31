import { useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { IoIosArrowBack } from "react-icons/io";
import ContractABI from '../ContractABI.json'
import { sepolia } from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import axios from 'axios';

const contractAddress = "0x8F3430b9ECeC52801611E5C13bB4477f90581f84";
const sdk = new ThirdwebSDK("sepolia");

const SendMoney = () => {
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(accounts[0]);
    const sdkWithSigner = ThirdwebSDK.fromSigner(signer);
    try {
      const response = await axios.post('/api/send-money', {
        account,
        amount,
      });

      if (response.status === 200) {
        console.log(response.data.message);

        const contract = await sdkWithSigner.getContract(contractAddress);
        console.log(contract);
        const usdamount = amount / 100;
        await contract.erc20.burn(usdamount);
      } else {
        console.error('An error occurred while sending money.');
        // Handle error case here
      }
    } catch (error) {
      console.error('An error occurred while sending money.', error);
      // Handle error case here
    }
  };

  const handleReturnToDashboard = () => {
    router.push("/wallet");
  };

  return (
    <div style={formContainerStyle}>
      <button onClick={handleReturnToDashboard} style={returnButtonStyle}>
        <IoIosArrowBack size={24} style={{ marginRight: "5px" }} />
        <span style={{ verticalAlign: "middle", fontSize: "18px" }}>Return to Dashboard</span>
      </button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Phone number"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ ...inputStyle, marginTop: "10px" }}
        />
        <button type="submit" style={submitButtonStyle}>Send Money</button>
      </form>
    </div>
  );
};

export default SendMoney;

// Styling
const formContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const inputStyle = {
  width: "300px",
  height: "40px",
  borderRadius: "8px",
  border: "1px solid white",
  paddingLeft: "10px",
  fontSize: "16px",
  color: "white",
  marginBottom: "10px", // Add spacing between input fields
  marginRight: "10px",
};

const submitButtonStyle = {
  width: "300px",
  height: "40px",
  borderRadius: "8px",
  border: "1px solid white",
  backgroundColor: "#3773f5",
  color: "black",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px", // Add spacing above the button
};

const returnButtonStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "transparent",
  border: "none",
  position: "absolute",
  top: "20px",
  left: "20px",
  textDecoration: "none",
  color: "white",
};
