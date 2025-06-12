function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  fetch('/api/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text })
  })
  .then(response => response.json())
  .then(data => {
    addMessage('Drako', text);
    addMessage('Navi', data.response);
  })
  .catch(() => {
    addMessage('Navi', 'Błąd połączenia z serwerem.');
  });
}

function addMessage(sender, message) {
  const container = document.getElementById('chat-container');
  const msgElem = document.createElement('div');
  msgElem.textContent = `${sender}: ${message}`;
  msgElem.style.padding = '8px';
  msgElem.style.margin = '4px 0';
  msgElem.style.borderRadius = '5px';
  msgElem.style.color = 'white';
  msgElem.style.maxWidth = '80%';
  msgElem.style.wordBreak = 'break-word';

  if(sender === 'Drako'){
    msgElem.style.backgroundColor = '#1976d2';
    msgElem.style.alignSelf = 'flex-end';
  } else {
    msgElem.style.backgroundColor = '#2e7d32';
    msgElem.style.alignSelf = 'flex-start';
  }

  container.appendChild(msgElem);
  container.scrollTop = container.scrollHeight;
}
