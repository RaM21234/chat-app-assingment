# Chat Application

This is a React Native chat application built with Expo, featuring a modern UI and several advanced functionalities.

## Features

- **Message Display:** Displays chat messages with sender information and timestamps.
- **Grouped Messages:** Automatically groups consecutive messages from the same participant for better readability.
- **Date Separators:** Inserts date separators between messages sent on different days.
- **Image Attachments:** Supports displaying image attachments within messages.
- **Image Preview Modal:** Tapping on an image attachment opens a full-screen preview modal.
- **User Avatars:** Displays user avatars with lazy loading and fallback to local images if the network URL fails.
- **@Mentions:** Allows users to mention participants in messages using the `@` symbol, with a suggestion list and highlighting of mentions in the chat.
- **Reply Functionality:** Displays a quoted original message when a message is a reply.
- **Local Data Persistence:** Utilizes Zustand's `persist` middleware with `AsyncStorage` to store chat data locally for offline access.
- **Efficient API Usage:** Employs polling for real-time updates and lazy loading for older messages to optimize API calls.

## Technologies Used

- **React Native:** Framework for building native mobile apps using JavaScript and React.
- **Expo:** A framework and platform for universal React applications.
- **Zustand:** A fast, scalable, and tiny state-management solution.
- **@react-native-async-storage/async-storage:** Persistent key-value storage for React Native.
- **@expo/vector-icons:** Provides access to a large set of icons.

## Installation

To set up and run the project locally, follow these steps:

1.  **Navigate to the project directory:**
    ```bash
    cd C:\Users\ramku\OneDrive\Desktop\new_folder\assingment\temp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Expo development server:**
    ```bash
    npm start
    # or
    expo start
    ```

4.  **Run on a device or emulator:**
    *   Scan the QR code with the Expo Go app on your phone.
    *   Press `a` for Android emulator/device.
    *   Press `i` for iOS simulator.

## Usage

- Type messages in the input field at the bottom.
- Use `@` to mention participants; a suggestion list will appear.
- Tap on image attachments to view them in a full-screen modal.
- Scroll up to load older messages.

## API Endpoints

The application interacts with a dummy chat server using the following endpoints:

-   `GET /info`: Returns server session UUID and API version.
-   `GET /messages/all`: Returns all messages.
-   `GET /messages/latest`: Returns the latest 25 messages.
-   `GET /messages/older/<ref-message-uuid>`: Returns 25 messages sent before a reference message.
-   `POST /messages/new`: Adds a new message.
-   `GET /messages/updates/<time>`: Returns messages updated after a given timestamp.
-   `GET /participants/all`: Returns all chat participants.
-   `GET /participants/updates/<time>`: Returns participants updated after a given timestamp.

## Folder Structure

```
temp/
├── App.js
├── package.json
├── README.md
└── src/
    ├── assets/             # Local image assets (e.g., fallback avatars)
    ├── components/         # Reusable UI components (ChatInput, Message, MessageList, etc.)
    │   ├── AttachmentImage.js
    │   ├── ChatInput.js
    │   ├── Message.js
    │   ├── MessageList.js
    │   ├── ParticipantBottomSheet.js
    │   └── ReactionsBottomSheet.js
    ├── services/           # API service calls (api.js)
    ├── store/              # Zustand store for application state (chatStore.js)
    └── ...                 # Other potential source files (main.jsx, theme.js)
```
