const chat = document.getElementById('chat');
const inputField = document.getElementById('inputField');
const sendButton = document.getElementById('sendButton');

function appendMessage(role, text) {
  const message = document.createElement('div');
  message.innerHTML = `<strong>${role}:</strong> ${text}`;
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

async function handleSend() {
  const input = inputField.value.trim();
  if (input === '') return;

  appendMessage('Ty', input);
  inputField.value = '';

  const response = await window.navi.sendMessage(input);
  appendMessage('Navi', response);
}

sendButton.addEventListener('click', handleSend);
inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') handleSend();
});
