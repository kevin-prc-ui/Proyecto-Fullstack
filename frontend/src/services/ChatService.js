import axios from "axios";
import { toast } from "sonner";

const REST_API_BASE_URL = "http://localhost:8080/api"; //update the base url

// Helper function to get the token from localStorage
const token = () => localStorage.getItem("authToken");
const getAuthToken = () => JSON.parse(token()).accessToken;

// Function to create headers with the Authorization token
const getHeaders = () => ({  
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
  
});


// Function to get messages (assuming it exists and works with ticketId)
export const listMessages = (ticketId) => {
    // Ensure backend endpoint matches: /api/tickets/{ticketId}/chat/messages (GET)
    return axios.get(`${REST_API_BASE_URL}/tickets/${ticketId}/chat/messages`, getHeaders());
};

// --- NEW FUNCTION ---
// Function to post a message (text and/or file)
export const postChatMessage = (ticketId, messageContent, file) => {
    const formData = new FormData();

    // 1. Append the message data as a JSON string part named "message"
    //    This matches the @RequestPart("message") in ChatController
    const messageDto = { content: messageContent };
    formData.append('message', new Blob([JSON.stringify(messageDto)], { type: 'application/json' }));

    // 2. Append the file part named "file" if it exists
    //    This matches the @RequestPart("file") in ChatController
    if (file) {
        formData.append('file', file);
    }

    // Ensure backend endpoint matches: /api/tickets/{ticketId}/chat/messages (POST)
    return axios.post(`${REST_API_BASE_URL}/tickets/${ticketId}/chat/messages`, formData, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            'Content-Type': 'multipart/form-data', // Axios usually sets this automatically for FormData
        },
    });
};
