import { useState } from 'react';
import useLocalStorage from 'use-local-storage';
import { useWeb3 } from '@3rdweb/hooks'
import { client } from '../sanity';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Dashboard from './Dashboard'
const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.2);
  margin: 50px auto;
  max-width: 400px;

  & > * {
    margin-bottom: 10px;
  }

  & > button {
    width: 100%;
    background-color: #0070f3;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }

  & > button:hover {
    background-color: #0062cc;
  }

  & > label {
    font-weight: bold;
  }

  & > input {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 100%;
  }
`;

export default function LoginPage() {
  const { address, connectWallet } = useWeb3();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useLocalStorage('userId', '');
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const handleLogin = async (event) => {
    event.preventDefault();
    const query = `*[_type == "user" && email == $email && password == $password][0]`;

    try {
      const result = await client.fetch(query, { email, password });
      setUserId(result._id);
      setUser(result);
      setFirstName(result.firstName)
      alert('Login successful!');
      // router.push('/wallet')
    } catch (error) {
      console.error(error);
      alert('Invalid email or password.');
    }
  };

  const handleLogout = () => {
    setUserId('');
    setUser(null);
  };
//   if (user) {
    
//     // // <div>
//     // //   <h1>Welcome, {user.firstName}!</h1>
//     // //   <button onClick={handleLogout}>Logout</button>
//     // // </div>
//     // router.push('/wallet')
//    <Dashboard address={address} />

// }
  if (userId && !user) {
    // Fetch user data if userId is present but user data isn't loaded yet
    const query = `*[_type == "user" && _id == $userId][0]`;
    client.fetch(query, { userId }).then((result) => {
      setUser(result);
    });
  }

  


  return (
    <>
      {user ? (
       <Wrapper>
       {address ? (
         <Dashboard address={address} user={user}/>
       ) : (
         <WalletConnect>
           <Button onClick={() => connectWallet('injected')}>
             Connect Wallet
           </Button>
           <Details>
             You need Chrome to be
             <br /> able to run this app.
           </Details>
         </WalletConnect>
       )}
     </Wrapper>
      ) : (
        <LoginForm onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </LoginForm>
      )}
    </>
  );
  
}



const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  max-width: 100vw;
  background-color: #0a0b0d;
  color: white;
  display: grid;
  place-items: center;
`

const WalletConnect = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Button = styled.div`
  /* flex: 0; */
  border: 1px solid #282b2f;
  padding: 0.8rem;
  font-size: 1.3rem;
  font-weight: 500;
  border-radius: 0.4rem;
  background-color: #3773f5;
  color: #000;

  &:hover {
    cursor: pointer;
  }
`

const Details = styled.div`
  font-size: 1.2rem;
  text-align: center;
  margin-top: 1rem;
  font-weight: 500;
  color: #282b2f;
`