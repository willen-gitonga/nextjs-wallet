import { useState } from 'react';
import { client } from '../sanity';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useSession } from 'next-auth/react';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
  margin-top: 150px;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1rem;
  font-weight: bold;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #0070f3;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #0060df;
  }

  &:active {
    background-color: #0050c9;
  }
`;

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const newUser = {
      _type: 'user',
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const result = await client.create(newUser);
      if (result && session) {
        setUserId(session.user.id);
      }
      console.log(`User was created with id ${result._id}`);
      router.push('/login'); // Navigate to the index page
    } catch (error) {
      console.error(error);
      alert('An error occurred while creating the user. Please try again later.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>
        First Name
        <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </Label>
      <Label>
        Last Name
        <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </Label>
      <Label>
        Email
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Label>
      <Label>
        Password
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Label>
      <Label>
        Confirm Password
        <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </Label>
      <Button type="submit">Register</Button>
    </Form>

  );
}