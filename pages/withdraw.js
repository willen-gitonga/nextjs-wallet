import React, { useState } from 'react';
import axios from 'axios';

const SendMoney = () => {
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/send-money', {
        account,
        amount,
      });

      if (response.status === 200) {
        console.log(response.data.message);
        // Money sent successfully, handle success case here
      } else {
        console.error('An error occurred while sending money.');
        // Handle error case here
      }
    } catch (error) {
      console.error('An error occurred while sending money.', error);
      // Handle error case here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Account"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit">Send Money</button>
    </form>
  );
};

export default SendMoney;
