const serverUrl = 'http://localhost:1969';

let result = {};

const handlesubmit = async (event) => {
  event.preventDefault();
  const form = event.target;
  const userLogin = {
    email: form.elements.namedItem('email').value,
    password: form.elements.namedItem('password').value,
  };

  const url = serverUrl + '/user/login/';
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(userLogin),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  result = await response.json();
  console.log('Login result', result);

  localStorage.setItem('week7', JSON.stringify({ token: result.token }));
};

const handleLogOut = () => {
  console.log('Logging out...', result);
  localStorage.removeItem('week7');
};

// Const logingWithToken = async (token) => {
//   const url = serverUrl + '/user/token/';
//   const userLogin = {
//     email: '', // Adjust based on your requirements
//     password: '', // Adjust based on your requirements
//   };

//   // Handle the response as needed
// };

// const storedData = localStorage.getItem('week7');
// if (storedData) {
//   logingWithToken(JSON.parse(storedData).token);
// }

// console.log('initial result', storedData);

document.querySelector('form').addEventListener('submit', handlesubmit);
document
  .querySelector('button[type="button"]')
  .addEventListener('click', handleLogOut);
