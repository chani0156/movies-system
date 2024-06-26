import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const USERNAME = process.env.REACT_APP_USERNAME;
const PASSWORD = process.env.REACT_APP_PASSWORD;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const login = async () => {
  const response = await api.post('login', {
    username: USERNAME,
    password: PASSWORD,
  });
  return response.data.token;
};

export const getMovies = async (token: string) => {
  const response = await api.get('GetMovies', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.map((movie: any) => ({
    ...movie,
    totalVotes: 0,
    lastUpdatedTime: '',
    positionChange: 'same',
  }));
};