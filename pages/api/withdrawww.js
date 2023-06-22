import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const CONSUMER_KEY = "";
const CONSUMER_SECRET = "";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const data = {
    initiatorName: "initiator_1",
    securityCredential: "",
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
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post("https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest", data, {
      headers,
    });

    if (response.status === 200) {
      res.status(200).json({ success: true });
    } else {
      res.status(response.status).json({ message: response.data.message });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
