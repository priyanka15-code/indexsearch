const axios = require('axios');

const createUserPayload = (index) => ({
  Name: `User${Date.now()}${index}`,
  Email: `user${Date.now()}${index}@example.com`, 
  PhoneNo: `123456789${index}`
});

// Function to generate multiple users
const generateUsersPayload = (numUsers) => {
  const users = [];
  for (let i = 1; i <= numUsers; i++) {
    users.push(createUserPayload(i));
  }
  return users; 
};

const sendMultipleUsersRequest = async (numUsers) => {
  const users = generateUsersPayload(numUsers); 
  
  try {
    const response = await axios.post('http://localhost:3000/api/users', users); 
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error sending users:', error.response ? error.response.data : error.message);
  }
};



sendMultipleUsersRequest(700);
