import { create } from "zustand";
import {
  getInfo,
  getMessages,
  getParticipants,
  sendMessage as sendMessageApi,
  getUpdates,
} from "../services/api";

export const useChatStore = create((set, get) => ({
  messages: [],
  participants: {},
  participantsByUuid: {}, // New map for efficient lookup
  currentUserUuid: null,
  loading: false,
  error: null,
  lastUpdateTimestamp: Date.now(),
  pollingIntervalId: null,
  loadingOlderMessages: false,
  hasMoreOlderMessages: true,

  actions: {
    initialize: async () => {
      console.log("chatStore: initialize called");
      try {
        set({ loading: true, error: null });

        console.log("chatStore: Fetching data from API.");
        const info = await getInfo();
        set({ currentUserUuid: info.sessionUuid });

        const [messages, participants] = await Promise.all([
          getMessages({ type: "latest" }),
          // getMessages({ type: "all" }),
          getParticipants(),
        ]);

        const fallbackImages = [
          require("../assets/user1.webp"),
          require("../assets/user2.jpg"),
          require("../assets/user3.jpg"),
          require("../assets/user4.webp"),
          require("../assets/user5.webp"),
          require("../assets/user6.webp"),
        ];

        const participantsMap = participants.reduce((acc, p) => {
          const randomIndex = Math.floor(Math.random() * fallbackImages.length);
          acc[p.uuid] = { ...p, fallbackImage: fallbackImages[randomIndex] };
          return acc;
        }, {});

        set({
          messages,
          participants: participantsMap,
          participantsByUuid: participantsMap, // Initialize the map
          loading: false,
          lastUpdateTimestamp: Date.now(),
        });

        get().actions.startPolling();
      } catch (error) {
        set({ error: error.message, loading: false });
        console.error("Initialization failed:", error);
      }
    },

    sendMessage: async (text) => {
      try {
        await sendMessageApi(text);
        // Instead of optimistically updating, trigger a poll to get the latest state
        get().actions.pollForUpdates();
      } catch (error) {
        set({ error: error.message });
        console.error("Failed to send message:", error);
      }
    },

    pollForUpdates: async () => {
      const lastUpdateTimestamp = get().lastUpdateTimestamp;
      console.log(`Polling for updates since: ${lastUpdateTimestamp}`);

      try {
        const updatedMessages = await getUpdates({
          type: "messages",
          since: lastUpdateTimestamp,
        });
        const updatedParticipants = await getUpdates({
          type: "participants",
          since: lastUpdateTimestamp,
        });

        set((state) => {
          // Create a map of existing messages by UUID for efficient lookup
          const messageMap = new Map(state.messages.map((m) => [m.uuid, m]));

          // Update or add new messages
          updatedMessages.forEach((updatedMessage) => {
            messageMap.set(updatedMessage.uuid, updatedMessage);
          });

          // Create a map for participants
          const newParticipants = { ...state.participants };
          const newParticipantsByUuid = { ...state.participantsByUuid };
          updatedParticipants.forEach((p) => {
            newParticipants[p.uuid] = p;
            newParticipantsByUuid[p.uuid] = p;
          });

          return {
            messages: Array.from(messageMap.values()).sort(
              (a, b) => a.sentAt - b.sentAt
            ),
            participants: newParticipants,
            participantsByUuid: newParticipantsByUuid, // Update the map
            lastUpdateTimestamp: Date.now(),
          };
        });
      } catch (error) {
        console.error("Failed to poll for updates:", error);
        // Don't set a global error for polling failures, as they can be transient
      }
    },

    startPolling: () => {
      // Clear any existing interval
      const existingIntervalId = get().pollingIntervalId;
      if (existingIntervalId) {
        clearInterval(existingIntervalId);
      }

      const intervalId = setInterval(() => {
        get().actions.pollForUpdates();
      }, 3000);

      set({ pollingIntervalId: intervalId });
    },

    stopPolling: () => {
      const intervalId = get().pollingIntervalId;
      if (intervalId) {
        clearInterval(intervalId);
        set({ pollingId: null });
      }
    },

    fetchOlderMessages: async (refMessageUuid) => {
      const { loadingOlderMessages, hasMoreOlderMessages } = get();
      if (loadingOlderMessages || !hasMoreOlderMessages) {
        return;
      }

      set({ loadingOlderMessages: true });
      try {
        const olderMessages = await getMessages({
          type: "older",
          refMessageUuid,
        });
        if (olderMessages.length === 0) {
          set({ hasMoreOlderMessages: false });
        } else {
          set((state) => {
            const messageMap = new Map(state.messages.map((m) => [m.uuid, m]));
            olderMessages.forEach((olderMessage) => {
              messageMap.set(olderMessage.uuid, olderMessage);
            });
            return {
              messages: Array.from(messageMap.values()).sort(
                (a, b) => a.sentAt - b.sentAt
              ),
            };
          });
        }
      } catch (error) {
        console.error("Failed to fetch older messages:", error);
      } finally {
        set({ loadingOlderMessages: false });
      }
    },
  },
}));
