const BASE_URL = 'https://dummy-chat-server.tribechat.com/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error: ${response.status} - ${errorText}`);
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }
  return response.json();
};

export const getInfo = async () => {
  console.log("API: Fetching info from", `${BASE_URL}/info`);
  const response = await fetch(`${BASE_URL}/info`);
  console.log("API: Info response - OK:", response.ok, "Status:", response.status);
  return handleResponse(response);
};

export const getMessages = async ({ type = 'latest', refMessageId = '' }) => {
  let url = `${BASE_URL}/messages/latest`;
  if (type === 'all') {
    url = `${BASE_URL}/messages/all`;
  } else if (type === 'older' && refMessageId) {
    url = `${BASE_URL}/messages/older/${refMessageId}`;
  }
  console.log("API: Fetching messages from", url);
  const response = await fetch(url);
  console.log("API: Messages response - OK:", response.ok, "Status:", response.status);
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