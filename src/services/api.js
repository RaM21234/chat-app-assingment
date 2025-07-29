const BASE_URL = 'https://dummy-chat-server.tribechat.com/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} ${error}`);
  }
  return response.json();
};

export const getInfo = async () => {
  const response = await fetch(`${BASE_URL}/info`);
  return handleResponse(response);
};

export const getMessages = async ({ type = 'latest', refMessageId = '' }) => {
  let url = `${BASE_URL}/messages/latest`;
  if (type === 'all') {
    url = `${BASE_URL}/messages/all`;
  } else if (type === 'older' && refMessageId) {
    url = `${BASE_URL}/messages/older/${refMessageId}`;
  }
  const response = await fetch(url);
  return handleResponse(response);
};

export const getUpdates = async ({ type = 'messages', since }) => {
    if (!since) {
        throw new Error('"since" timestamp is required for updates');
    }
    let url = `${BASE_URL}/messages/updates/${since}`;
    if (type === 'participants') {
        url = `${BASE_URL}/participants/updates/${since}`;
    }
    const response = await fetch(url);
    return handleResponse(response);
}

export const sendMessage = async (text) => {
  const response = await fetch(`${BASE_URL}/messages/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  return handleResponse(response);
};

export const getParticipants = async () => {
  const response = await fetch(`${BASE_URL}/participants/all`);
  return handleResponse(response);
};