import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api"; //update the base url

// Helper function to get the token from localStorage
const getAuthToken = () => localStorage.getItem("authToken");

// Function to create headers with the Authorization token
const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

// export const tickets = [
//   {
//     id: "65c5f12ab5204a81bde866a9",
//     title: "Test ticket",
//     date: "2024-02-09T00:00:00.000Z",
//     priority: "alta",
//     stage: "todo",
//     team: [
//       {
//         id: "65c202d4aa62f32ffd1303cc",
//         name: "Codewave Asante",
//         title: "Administrator",
//         email: "admin@gmail.com",
//       },
//       {
//         id: "65c30b96e639681a13def0b5",
//         name: "Jane Smith",
//         title: "Product Manager",
//         email: "jane.smith@example.com",
//       },
//       {
//         id: "65c317360fd860f958baa08e",
//         name: "Alex Johnson",
//         title: "UX Designer",
//         email: "alex.johnson@example.com",
//       },
//     ],
//     isTrashed: false,
//     activities: [],
//     subTickets: [
//       {
//         title: "Ticket youtube tutorial",
//         date: "2024-02-09T00:00:00.000Z",
//         tag: "tutorial",
//         id: "65c5f153b5204a81bde866c8",
//       },
//     ],
//     createdAt: "2024-02-09T09:32:26.574Z",
//     updatedAt: "2024-02-09T09:36:53.339Z",
//     __v: 1,
//   }
// ]

export const listTickets = () =>
  axios
    .get(REST_API_BASE_URL+"/tickets", getHeaders())
    .then((response) => response)
    .catch((error) => {
      // Detectamos específicamente errores de conexión
      if (!error.response) {
        throw new Error("Error de conexion con el servidor");
      }
      throw error;
    });

const fetchTickets = await listTickets();
console.log(fetchTickets.data);

export const tickets = fetchTickets.data;

