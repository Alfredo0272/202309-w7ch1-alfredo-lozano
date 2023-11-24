const serverUrl = 'http://localhost:1969';

const handlesubmit = async (event) => {
  event.preventDefault();
  const form = event.target;
  const userLogin = {
    email: form.elements.namedItem('email').value,
    password: form.elements.namedItem('password').value,
  };

  const url = serverUrl + '/user/loggin/';
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(userLogin),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  console.log('Login result', result);

  localStorage.setItem('week7', JSON.stringify({ token: result.token }));
};

const handleLogOut = () => {
  console.log('Logging out...', result);
  localStorage.removeItem('week7');
};

const storedToken = JSON.parse(localStorage.getItem('week7')) || {};

const result = { token: storedToken.token };

document.querySelector('form').addEventListener('submit', handlesubmit);
document
  .querySelector('button[type="button"]')
  .addEventListener('click', handleLogOut);
