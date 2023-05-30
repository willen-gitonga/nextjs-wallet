import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: 'y2vd9vax',
  dataset: 'production',
  apiVersion: "2023-02-20",
  useCdn: false,
  token: "sk513eR5DVvb5ThvrA405J7aAw4krvuzKf3CorqwgecQ4heYRetrwGZLCx2rLP56N0k0smxrYOyD85Qq5uKUSlfchugaP6s7Pn3j1vgOAeNPmeDGKtO9a1ZGdlnWPA9CtnQiMWokTpYfcaAIjU3stFzuYICP18X71ry0X5GRnL9m719uJJlM"
});



import React, { useState } from "react";
import { useRouter } from "next/router";
import { axios } from "axios";

const CONSUMER_KEY = "Aj18rEfHxdgAaRVHvV1XmAH9vFnrvrOV";
const CONSUMER_SECRET = "KGdjkdfP3prf9zv6";

const WithdrawMoney = () => {
  const [amount, setAmount] = useState("");
  const [partyB, setPartyB] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
        initiatorName: "initiator_1",
        securityCredential: "fUIYegHWpFnYAjKOEvVsuqMkWO3utMCigoud+hnrSyShRZqZSOwhkIkGtpArCm65wk7mn2gYkxoh6lVaJGDQNeO65Pd/t8A7lZIH7w5jFoo4CHdf2yE4JF9j8GnQWyTQm5l/8M7tcw+wztLPorx2CN27IHyfADrJZ5a/ccK/G6fGhvnRYmGYFlYVtAsZTHP8kplRMCzP5hjqXRMPYm1+ffuAOJo1HzbCF+b+G9liMVKb4B/9Q2wyRPDaKxylY4L0cFyIgRlYOu0lV5UhvkZObPwkys0EnkPSWkvhkTJNXWmRmHDa9AaiS1qpwyguSnyQwHIjOD3RtGLGw5+WxHS7KQ==",
        commandID: "BusinessPayment",
        amount,
        partyA: "600737",
        partyB,
        remarks: "here are my remarks",
        queueTimeOutURL: "https://1aed-102-68-77-69.ngrok-free.app/mint",
        resultURL: "https://1aed-102-68-77-69.ngrok-free.app/wallet",
        occasion: "Withdrawal",
      };

    const headers = {
      "Authorization": `Bearer ${CONSUMER_KEY}:${CONSUMER_SECRET}`,
    };

    try {
      const response = await axios.post("https://api.safaricom.com/daraja/v2/b2c/initiate-payment", data, {
        headers,
      });

      if (response.status === 200) {
        router.push("/success");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Withdraw Money</h1>
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />
      <input
        type="text"
        placeholder="PartyB"
        value={partyB}
        onChange={(event) => setPartyB(event.target.value)}
      />
      <button onClick={handleSubmit}>Withdraw</button>
    </div>
  );
};

export default WithdrawMoney;