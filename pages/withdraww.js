import axios from "axios";
import { useState } from 'react';

export default function SendMoney() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get the amount and recipient from the form.
    const submittedAmount = amount;
    const submittedRecipient = recipient;

    // Make a request to the API.
    const response = await axios.post("/api/send-money", {
      amount: submittedAmount,
      recipient: submittedRecipient,
    });

    if (response.status === 200) {
      // Success!
      alert("Money sent successfully!");
    } else {
      // Error!
      alert("An error occurred while sending money. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />
      <input
        type="text"
        placeholder="Recipient"
        value={recipient}
        onChange={(event) => setRecipient(event.target.value)}
      />
      <button type="submit">Send Money</button>
    </form>
  );
}
