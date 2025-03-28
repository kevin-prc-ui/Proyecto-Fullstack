import axios from "axios";
const REST_API_BASE_URL = "http://localhost:8080/api";
// Helper function to get the token from sessionStorage
const getAuthToken = () => sessionStorage.getItem("authToken");


// Function to create headers with the Authorization token
const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});
const prioridad = () => axios.get(REST_API_BASE_URL,"/prioridad", getHeaders());

const prioridadMap = new Map();

prioridadMap.set(prioridad);
console.log(prioridadMap)
