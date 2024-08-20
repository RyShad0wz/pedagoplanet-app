import axiosInstance from './axiosInstance';

const handleSubmit = async (event) => {
  event.preventDefault();
  
  try {
    const response = await axiosInstance.post('/api/login', {
      username: 'username',
      password: 'password',
    });
    console.log(response.data);
  } catch (error) {
    console.error('Login error:', error);
  }
};
