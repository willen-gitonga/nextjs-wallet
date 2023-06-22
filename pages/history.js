import { useState, useEffect } from "react";
import Moralis from "moralis";
import Web3 from "web3";
import ContractABI from '../ContractABI.json'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const MORALIS_API_KEY = ""; // Replace with your own Moralis API key
const CONTRACT_ADDRESS = "0x8F3430b9ECeC52801611E5C13bB4477f90581f84"; // Replace with the address of your token contract
const CONTRACT_ABI = ContractABI;

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("mint");

  useEffect(() => {
    async function fetchTransactions() {
      await Moralis.start({ apiKey: MORALIS_API_KEY });

      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const address = web3.eth.defaultAccount;

      const response = await contract.getPastEvents("Transfer", {
        filter: { from: address },
        fromBlock: 0,
        toBlock: "latest"
      });

      // Loop through each transaction and query its block for the timestamp
      const txsWithTimestamps = await Promise.all(
        response.map(async (tx) => {
          const block = await web3.eth.getBlock(tx.blockNumber);
          const timestamp = block.timestamp;
          const isMint = tx.returnValues.from === '0x0000000000000000000000000000000000000000';
          const transactionType = isMint ? 'Deposit' : 'Transfer';
          return { ...tx, timestamp, transactionType };
        })
      );

      setTransactions(txsWithTimestamps);
    }

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Transaction History Chart</h2>
      <div style={{ marginTop: "50px" }}>
      <LineChart
      width={1000}
      height={400}
      data={transactions}
      margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
       >
      <XAxis dataKey="timestamp" tickFormatter={dateFormatter} />
      <YAxis tickFormatter={valueFormatter} />
      <Tooltip formatter={valueFormat} />
      <Line type="monotone" dataKey="returnValues.value" stroke="#3773F5" />
    </LineChart>

      </div>
      <div className="transaction-tabs">
        <div
          className={`transaction-tab ${
            activeTab === "mint" ? "active" : ""
          }`}
          onClick={() => setActiveTab("mint")}
        >
          Deposit Transactions
        </div>
        <div
          className={`transaction-tab ${
            activeTab === "transfer" ? "active" : ""
          }`}
          onClick={() => setActiveTab("transfer")}
        >
          Transfer Transactions
        </div>
      </div>
      <div className="transactions-container">
        <div
          className={`mint-transactions ${
            activeTab === "mint" ? "active-mint-transactions" : "inactive-mint-transactions"
          }`}
        >
          <h2>Deposit Transactions</h2>
          {transactions
            .filter((tx) => tx.transactionType === "Deposit")
            .map((tx) => (
              <div key={tx.transactionHash} className="transaction-card" onClick={() => console.log(tx)}>
                <p>To: {tx.returnValues.to}</p>
                <p>Amount: {parseFloat(tx.returnValues.value) / 10 ** 18} USDT</p>
                <p>
                  Timestamp:{" "}
                  {new Date(tx.timestamp * 1000).toLocaleString("en-US", {
                    timeZone: "Africa/Nairobi",
                  })}
                </p>
                {activeTab === "mint" && (
                  <>
                    <p>From: {tx.returnValues.from}</p>
                    <p>Transaction Type: {tx.transactionType}</p>
                  </>
                )}
              </div>
            ))}
        </div>
        <div
          className={`transfer-transactions ${
            activeTab === "transfer" ? "active-transfer-transactions" : "inactive-transfer-transactions"
          }`}
        >
          <h2>Transfer Transactions</h2>
          {transactions
            .filter((tx) => tx.transactionType === "Transfer")
            .map((tx) => (
              <div key={tx.transactionHash} className="transaction-card" onClick={() => console.log(tx)}>
                <p>To: {tx.returnValues.to}</p>
                <p>Amount: {parseFloat(tx.returnValues.value) / 10 ** 18} USDT</p>
                <p>
                  Timestamp:{" "}
                  {new Date(tx.timestamp * 1000).toLocaleString("en-US", {
                    timeZone: "Africa/Nairobi",
                  })}
                </p>
                {activeTab === "transfer" && (
                  <>
                    <p>From: {tx.returnValues.from}</p>
                    <p>Transaction Type: {tx.transactionType}</p>
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
  
}

      function dateFormatter(timestamp) {
        return new Date(timestamp * 1000).toLocaleString("en-US", { 
          timeZone: "Africa/Nairobi", 
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
      }
      

      function valueFormatter(value) {
        const formattedValue = (value / 10 ** 18); // divide by 10^18 to convert from wei to USDT
        return `${formattedValue} USDT`;
      }
      
      

      function valueFormat(value, name) {
        if (name === "returnValues.value") {
          return `${parseFloat(value) / 10 ** 18} USDT`;
        }
        if (name === "value") {
          return `${parseFloat(value) / 10 ** 18} USDT`;
        }
        return value.toLocaleString();
      }