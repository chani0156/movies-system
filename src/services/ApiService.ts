import axios, { AxiosInstance } from 'axios';
import { LoginResponse, Movie } from '../models/types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const USERNAME = process.env.REACT_APP_USERNAME;
const PASSWORD = process.env.REACT_APP_PASSWORD;

if (!API_BASE_URL || !USERNAME || !PASSWORD) {
  throw new Error('Missing environment variables: Please ensure REACT_APP_API_BASE_URL, REACT_APP_USERNAME, and REACT_APP_PASSWORD are set.');
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (): Promise<string> => {
  try {
    const response = await api.post<LoginResponse>('login', {
      username: USERNAME,
      password: PASSWORD,
    });
    return response.data.token;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed');
  }
};

export const getMovies = async (token: string): Promise<Movie[]> => {
  try {
    const response = await api.get<Movie[]>('GetMovies', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.map((movie) => ({
      ...movie,
      totalVotes: 0,
      lastUpdatedTime: '',
      positionChange: 'same',
    }));
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies');
  }
};

export default api;