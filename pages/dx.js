import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/PaymentForm.module.css';
import { ethers } from "ethers";
import ContractABI from '../ContractABI.json'
import { sepolia } from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";

const sdk = new ThirdwebSDK("sepolia");

const contractAddress = "0x8F3430b9ECeC52801611E5C13bB4477f90581f84";

const PaymentForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const router = useRouter();


  async function handleMint() {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(accounts[0]);
      const sdkWithSigner = ThirdwebSDK.fromSigner(signer);

      if (amount === undefined || amount === '') {
        console.error("Amount is not defined.");
        return;
      }

      const contract = await sdkWithSigner.getContract(contractAddress);
      console.log(contract);
      await contract.erc20.mint(amount);
    } catch (error) {
      console.error(error);
    }
  }

  const handleCardNumberChange = (e) => {
    setCardNumber(e.target.value);
  };

  const handleExpiryDateChange = (e) => {
    setExpiryDate(e.target.value);
  };

  const handleCvvChange = (e) => {
    setCvv(e.target.value);
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleZipCodeChange = (e) => {
    setZipCode(e.target.value);
  };
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleMint();
    setIsLoading(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      if (
        (cardNumber === '4000 0000 0000 1091' &&
          expiryDate === '07/28' &&
          cvv === '123') ||
        (cardNumber === '5200 0000 0000 0007' &&
          expiryDate === '07/28' &&
          cvv === '123')
      ) {
        setPaymentStatus('Payment successful!You will be redirected to the wallet page');
        // Call handleMint with the captured amount
      } else {
        setPaymentStatus('Payment failed. Please check your card details.');
      }
      setIsLoading(false);
    }, 12000);
  };

  useEffect(() => {
    if (paymentStatus === 'Payment successful!You will be redirected to the wallet page') {
      setTimeout(() => {
        router.push('/wallet');
      }, 12000);
    }
  }, [paymentStatus]);

  return (
    
    <form className={styles.PaymentForm} onSubmit={handleSubmit}>
    <div>
    <h2 style={{ color: 'white'}}>Enter the details below to load your wallet</h2>
    <br></br>
      <label htmlFor="cardNumber">Card Number</label>
      <input
        className={styles.input}
        type="text"
        id="cardNumber"
        value={cardNumber}
        onChange={handleCardNumberChange}
        required
      />
    </div>
    <div>
      <label htmlFor="expiryDate">Expiry Date</label>
      <input
        className={styles.input}
        type="text"
        id="expiryDate"
        value={expiryDate}
        onChange={handleExpiryDateChange}
        required
      />
    </div>
    <div>
      <label htmlFor="cvv">CVV</label>
      <input
        className={styles.input}
        type="text"
        id="cvv"
        value={cvv}
        onChange={handleCvvChange}
        required
      />
    </div>
    <div>
      <label htmlFor="fullName">Full Name</label>
      <input
        className={styles.input}
        type="text"
        id="fullName"
        value={fullName}
        onChange={handleFullNameChange}
        required
      />
    </div>
    <div>
      <label htmlFor="address">Address</label>
      <input
        className={styles.input}
        type="text"
        id="address"
        value={address}
        onChange={handleAddressChange}
        required
      />
    </div>
    <div>
      <label htmlFor="city">City</label>
      <input
        className={styles.input}
        type="text"
        id="city"
        value={city}
        onChange={handleCityChange}
        required
      />
    </div>
    <div>
      <label htmlFor="zipCode">ZIP Code</label>
      <input
        className={styles.input}
        type="text"
        id="zipCode"
        value={zipCode}
        onChange={handleZipCodeChange}
        required
      />
    </div>
    <div>
      <label htmlFor="amount">Amount</label>
      <input
        className={styles.input}
        type="text"
        id="amount"
        value={amount}
        onChange={handleAmountChange}
        required
      />
    </div>
    <button className={styles.button} type="submit">Pay Now</button>
    {isLoading ? (
      <div className={styles.loading}>Loading...</div>
    ) : (
      paymentStatus && (
        <div
          className={paymentStatus.includes('failed') ? styles.error : styles.success}
        >
          {paymentStatus}
        </div>
      )
    )}
  </form>
  );
  
};

export default PaymentForm;

