const serverUrl = 'http://localhost:1969/';

const handlesubmit = async (event) => {
  event.preventDefault();
  const form = event.target;
  const userLogin = {
    email: form.elements.getNamedItem('email').value,
    paswword: form.elements.getNamedItem('password').value,
  };

  const url = serverUrl + 'logging/';
  const response = fetch(url, {
    method: 'POST',
    body: JSON.stringify(userLogin),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.JSON;
  return result;
};

document.querySelector('form').addEventListener('submit', handlesubmit);
