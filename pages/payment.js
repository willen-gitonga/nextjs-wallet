import { useState } from 'react';
import Header from '../components/Header'

const PesapalPayment = () => {
  const [amount, setAmount] = useState('');
  const [iframeSrc, setIframeSrc] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [line1, setLine1] = useState('');

   const handlePayment = async () => {
    //Request an access token
    const accessToken = await requestAccessToken();

    // Register IPN URL
    const ipnId = await registerIPNURL(accessToken);

    // Submit the payment order request
    const paymentOrderResponse = await submitPaymentOrderRequest(accessToken, ipnId);

    // Load the payment iframe
    setIframeSrc(paymentOrderResponse.redirect_url);
  };

  const requestAccessToken = async () => {
   
    const response = await fetch('https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        consumer_key: '',
        consumer_secret: ''
      })
    });
  
    const data = await response.json();
    // console.log(data);
    // console.log(data.token);
    return data.token;
  };
  
  const registerIPNURL = async (accessToken) => {
    const response = await fetch('https://cybqa.pesapal.com/pesapalv3/api/URLSetup/RegisterIPN', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url: 'https://www.myapplication.com/ipn',
        ipn_notification_type: 'GET'
      }),
    });
    const data = await response.json();
    return data.ipn_id;
  };
  const submitPaymentOrderRequest = async (accessToken,ipnId) => {
    const uniqueId = Math.random().toString(36).substring(7); // generate a random ID
    const payload = {
      id: uniqueId,
      currency: 'KES',
      amount: Number(amount),
      description: 'Payment description goes here',
      callback_url: 'https://www.myapplication.com/response-page',
      notification_id: ipnId,
      billing_address: {
        email_address: email,
        phone_number: '0723xxxxxx',
        country_code: 'KE',
        first_name: firstName,
        middle_name: '',
        last_name: lastName,
        line_1: line1,
        line_2: '',
        city: '',
        state: '',
        postal_code: '',
        zip_code: '',
      },
    };

    const response = await fetch('https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log(data);
    return data;
  };

  return (
    
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', padding: '2rem', maxWidth: '40rem', width: '100%' }}>
        <h2 style={{ color: 'black'}}>Enter the details below to load your wallet</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="amount" style={{ display: 'block', marginBottom: '.5rem' }}>
            Amount
          </label>
          <input
            type="text"
            id="amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: '.5rem', borderRadius: '.25rem', border: '1px solid #ccc', width: '100%' }}
          />
          <label htmlFor="email" style={{ display: 'block', marginBottom: '.5rem' }}>
            Email Address
          </label>
          <input
            type="email" 
            value={email} 
            placeholder="Enter email address"
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '.5rem', borderRadius: '.25rem', border: '1px solid #ccc', width: '100%' }}
          />
          <label htmlFor="firstName" style={{ display: 'block', marginBottom: '.5rem' }}>
          First Name:
          </label>
          <input
            type="text"
            id="firstName"
            placeholder="First Name"
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)}
            style={{ padding: '.5rem', borderRadius: '.25rem', border: '1px solid #ccc', width: '100%' }}
          />
          <label htmlFor="lastName" style={{ display: 'block', marginBottom: '.5rem' }}>
          Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            placeholder="Last Name"
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)}
            style={{ padding: '.5rem', borderRadius: '.25rem', border: '1px solid #ccc', width: '100%' }}
          />
          <label htmlFor="line1" style={{ display: 'block', marginBottom: '.5rem' }}>
          Address Line 1:
          </label>
          <input
            type="text"
            id="line1"
            placeholder="Address Line 1"
            value={line1} 
            onChange={(e) => setLine1(e.target.value)}
            style={{ padding: '.5rem', borderRadius: '.25rem', border: '1px solid #ccc', width: '100%' }}
          />

        </div>
        <button onClick={handlePayment} style={{ padding: '.5rem 1rem', borderRadius: '.25rem', border: 'none', background: '#0070f3', color: '#fff' }}>
          Load Wallet
        </button>
        {iframeSrc && (
          <div style={{ marginTop: '1rem', overflow: 'hidden', borderRadius: '.25rem', boxShadow: '0 0 4px rgba(0,0,0,.1)' }}>
            <iframe src={iframeSrc} style={{ width: '100%', height: '400px', border: 'none' }}></iframe>
          </div>
        )}
      </div>
    </div>
  );
  
  
};

export default PesapalPayment;
