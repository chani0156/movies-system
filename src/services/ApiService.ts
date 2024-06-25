import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const USERNAME = process.env.REACT_APP_USERNAME;
const PASSWORD = process.env.REACT_APP_PASSWORD;

export const login = async () => {
    const response = await fetch(`${API_BASE_URL}login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: USERNAME,
        password: PASSWORD,
      }),
    });
    const data = await response.json();
    return data.token; // Assuming the token is returned upon successful login
  };
  
  export const getMovies = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}GetMovies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  };

