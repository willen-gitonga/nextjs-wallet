import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const CONSUMER_KEY = "Aj18rEfHxdgAaRVHvV1XmAH9vFnrvrOV";
const CONSUMER_SECRET = "KGdjkdfP3prf9zv6";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const data = {
    initiatorName: "initiator_1",
    securityCredential: "Ev3L2EDVpUKAf603qnJSTyOZi7jTuROMB94v5ur0A2sTY3Wq6/yJwp1kqLOwFZvhLDKXVexxdUPs25+gR4eD9kkuWi85+UjGiC3n2GH+yJK+cpBqSO40+08g6yb5w+we3rvsQZeVFaiIgw4Y1oIHvfy02DNOAf8uWHTI8RHLVknjCLlCkYNXe+ZC5ZRrCVli1rwHgKR17bxTng+VVXFVcoE+SYplRZ/8+ca94NiUlajg4+7IKExvTKLn+6yRQg9EJ/BITynY3V8/cTznEpnU8FZaCQYiyW8f7Y0iEa9GLZP8SQ5OuS9aW1Y4iSiS7e1noakQHIzO8tYKncxAXfGtAg==",
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
