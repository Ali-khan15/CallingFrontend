import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom'; // For redirecting

function Home() {
  const [script, setScript] = useState('');
  const [numbers, setNumbers] = useState(['']);
  const [user, setUser] = useState({
    fullName: '',
    companyName: ''
  }); // Initialize user info from localStorage
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details from localStorage
    const fullName = localStorage.getItem('fullName');
    const companyName = localStorage.getItem('companyName');

    if (fullName && companyName) {
      setUser({ fullName, companyName });
    } else {
      alert('User not found, please login.');
      navigate('/login'); // Redirect to login page if not logged in
    }
  }, [navigate]);

  const handleAddNumber = () => {
    setNumbers([...numbers, '']);
  };

  const handleNumberChange = (index, value) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
  };

  const handleSubmitScript = async () => {
    if (!script.trim()) {
      alert('Please enter a valid script.');
      return;
    }
  
    // Submit the script to the backend
    try {
      const response = await fetch('https://calling-backend-blond.vercel.app/submit-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script,
          user: user.fullName,
          companyName: user.companyName,
        }),
      });
  
      if (response.ok) {
        alert('Script submitted!');
      } else {
        alert('Failed to submit the script.');
      }
    } catch (error) {
      console.error('Error submitting the script:', error);
    }
  };
  const handleCallUsers = async () => {
    if (numbers.some((num) => !num.trim())) {
      alert('Please enter valid phone numbers.');
      return;
    }

    // Call the users using Vonage API
    try {
      const response = await fetch('https://calling-backend-blond.vercel.app/call-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numbers,
          script,
          user: user.fullName,
          companyName: user.companyName,
        }),
      });

      if (response.ok) {
        alert('Calling users!');
      } else {
        alert('Failed to initiate calls.');
      }
    } catch (error) {
      console.error('Error calling users:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="heading">AI Phone Calls</h1>
      {user && <p>Hello !<span className='para'> {user.fullName}</span> from <span className='para'>{user.companyName} </span>Make a phone call with us !</p>}

      <textarea
        className="script-box"
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Write your calling script here"
      ></textarea>

      <button className="submit-btn" onClick={handleSubmitScript}>Submit Script</button>

      <div className="number-container">
        {numbers.map((number, index) => (
          <input
            key={index}
            type="text"
            className="number-input"
            value={number}
            onChange={(e) => handleNumberChange(index, e.target.value)}
            placeholder="Enter phone number"
          />
        ))}

        <button className="add-more" onClick={handleAddNumber}>Add More</button>

        <button className="submit-btn" onClick={handleCallUsers}>Call a User</button>
      </div>
    </div>
  );
}

export default Home;
