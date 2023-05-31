import { useState, useEffect } from "react";
import Moralis from "moralis";
import Web3 from "web3";
import ContractABI from '../ContractABI.json'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MORALIS_API_KEY = "motI9dRnMSeempoMPYnx4SgGYG2qfmfQWTZjoeO45JwT0FgqOOh5dIXX2Ad5NLCW"; // Replace with your own Moralis API key
const CONTRACT_ADDRESS = "0x8F3430b9ECeC52801611E5C13bB4477f90581f84"; // Replace with the address of your token contract
const CONTRACT_ABI = ContractABI;

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [linetransactions, setlineTransactions] = useState([]);
  const [transferTransactions, setTransferTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("mint");
  const [receivedTransactions, setReceivedTransactions] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [balanceData, setBalanceData] = useState([]);
  useEffect(() => {
    async function fetchTransactions() {
      await Moralis.start({ apiKey: MORALIS_API_KEY });

      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      setWalletAddress(address);

      const balanceresponse = await contract.getPastEvents("Transfer", {
        filter: { $or: [{ to: address }, { from: address }] },
        fromBlock: 0,
        toBlock: "latest"
      });

      const response = await contract.getPastEvents("Transfer", {
        filter: { to: address },
        fromBlock: 0,
        toBlock: "latest"
      });

      const transferResponse = await contract.getPastEvents("Transfer", {
        filter: { from: address },
        fromBlock: 0,
        toBlock: "latest"
      });

      const balancetxsWithTimestamps = await Promise.all(
        balanceresponse.map(async (tx) => {
          const block = await web3.eth.getBlock(tx.blockNumber);
          const timestamp = block.timestamp;
          const isMint = tx.returnValues.from === '0x0000000000000000000000000000000000000000';
          const transactionType = isMint ? 'Deposit' : 'Transfer';
          return { ...tx, timestamp, transactionType };
        })
      );
      const sortedTransactions = balancetxsWithTimestamps.sort((a, b) => a.timestamp - b.timestamp);

      const balance = [];
      let currentBalance = 0;

      sortedTransactions.forEach((tx) => {
        const { returnValues, timestamp } = tx;
        const { from, to, value } = returnValues;
        if (from.toLowerCase() === address.toLowerCase()) {
          currentBalance -= parseFloat(value);
        } else if (to.toLowerCase() === address.toLowerCase()) {
          currentBalance += parseFloat(value);
        }
        balance.push({ timestamp, balance: currentBalance });
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
      const transferTxsWithTimestamps = await Promise.all(
        transferResponse.map(async (tx) => {
          const block = await web3.eth.getBlock(tx.blockNumber);
          const timestamp = block.timestamp;
          const isMint = tx.returnValues.from === '0x0000000000000000000000000000000000000000';
          const transactionType = isMint ? 'Deposit' : 'Transfer';
          return { ...tx, timestamp, transactionType };
        })
      );

      const receivedResponse = await contract.getPastEvents("Transfer", {
        filter: { to: address },
        fromBlock: 0,
        toBlock: "latest"
      });
      
      const receivedTxsWithTimestamps = await Promise.all(
        receivedResponse.map(async (tx) => {
          const block = await web3.eth.getBlock(tx.blockNumber);
          const timestamp = block.timestamp;
          const isMint = tx.returnValues.from === '0x0000000000000000000000000000000000000000';
          const transactionType = isMint ? 'Deposit' : 'Transfer';
          const fromAddress = isMint ? '' : tx.returnValues.from;
          return { ...tx, timestamp, transactionType, fromAddress };
        })
      );
       setTransactions(txsWithTimestamps);
      setReceivedTransactions(receivedTxsWithTimestamps);
      setTransferTransactions(transferTxsWithTimestamps);
      setBalanceData(balance);
    }

    fetchTransactions();
  }, []);

  return (
    <div>
      <div>
      <LineChart
          width={900}
          height={400}
          data={balanceData}
          margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="timestamp" tickFormatter={dateFormatter} />
          <YAxis tickFormatter={valueFormatter} />
          <Tooltip formatter={valueFormat} />
          <Line type="monotone" dataKey="balance" name="balance" stroke="#3773F5" />
        </LineChart>
      </div>
      <br />
      <h2>Recent Transactions</h2>
      <br />
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
        <div
          className={`transaction-tab ${
            activeTab === "receive" ? "active" : ""
          }`}
          onClick={() => setActiveTab("receive")}
        >
          Received Transactions
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
        <div className="transaction-info">
          <p>To: {tx.returnValues.to}</p>
          <p>Amount: {parseFloat(tx.returnValues.value) / 10 ** 18} USDT</p>
        </div>
        <div className="transaction-info">
          <p>
            Timestamp:{" "}
            {new Date(tx.timestamp * 1000).toLocaleString("en-US", {
              timeZone: "Africa/Nairobi",
            })}
          </p>
          {/* {activeTab === "mint" && (
            <p>From: {tx.returnValues.from}</p>
          )} */}
        </div>
      </div>
    ))}
</div>

        <div
          className={`transfer-transactions ${
            activeTab === "transfer" ? "active-transfer-transactions" : "inactive-transfer-transactions"
          }`}
        >
          <h2>Transfer Transactions</h2>
          {transferTransactions
            .filter((tx) => tx.transactionType === "Transfer")
            .map((tx) => (
              <div key={tx.transactionHash} className="transaction-card" onClick={() => console.log(tx)}>
                <div className="transaction-info">
                  <p>To: {tx.returnValues.to}</p>
                  <p>Amount: {parseFloat(tx.returnValues.value) / 10 ** 18} USDT</p>
                </div>
                <div className="transaction-info">
                  <p>
                    Timestamp:{" "}
                    {new Date(tx.timestamp * 1000).toLocaleString("en-US", {
                      timeZone: "Africa/Nairobi",
                    })}
                  </p>
                  {/* {activeTab === "transfer" && (
                    <p>From: {tx.returnValues.from}</p>
                  )} */}
                </div>
              </div>
            ))}
        </div>
        <div
  className={`receive-transactions ${
    activeTab === "receive" ? "active-receive-transactions" : "inactive-receive-transactions"
  }`}
>
  <h2>Received Transactions</h2>
  {receivedTransactions
    .filter((tx) => tx.transactionType === "Transfer" && tx.returnValues.from !== '0x0000000000000000000000000000000000000000')
    .map((tx) => (
      <div key={tx.transactionHash} className="transaction-card" onClick={() => console.log(tx)}>
        <div className="transaction-info">
          <p>From: {tx.returnValues.from}</p>
          <p>Amount: {parseFloat(tx.returnValues.value) / 10 ** 18} USDT</p>
        </div>
        <div className="transaction-info">
          <p>
            Timestamp:{" "}
            {new Date(tx.timestamp * 1000).toLocaleString("en-US", {
              timeZone: "Africa/Nairobi",
            })}
          </p>
        </div>
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
  const formattedValue = (value / 10 ** 18).toFixed(2); // divide by 10^18 to convert from wei to USDT and fix to 2 decimal places
  const trimmedValue = parseFloat(formattedValue); // remove trailing zeros
  return `${trimmedValue} USDT`;
}





function valueFormat(value, name) {
  if (name === "returnValues.value") {
    return `${parseFloat(value) / 10 ** 18} USDT`;
  }
  if (name === "balance") {
    return `${parseFloat(value) / 10 ** 18} USDT`;
  }
  return value.toLocaleString();
}

