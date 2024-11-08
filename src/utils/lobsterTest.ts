const axios = require("axios");

// Define the type for a user object
interface User {
  user_public_key: string;
  user_detailed_points: any[]; // You can define this more specifically if you know the structure
  user_points: number;
}

// Replace with the actual base URL of your Lobster API
const LOBSTER_API_BASE_URL = "https://api.prod.lobster-protocol.com/v1/users/leaderboard/";

// Function to fetch Lobster points and filter by address
const fetchLobsterPoints = async (userAddress: string) => {
  try {
    const response = await axios.get(LOBSTER_API_BASE_URL);

    // Log the entire response data to inspect its structure
    console.log("Response data:", response.data);

    // Check if response.data is an array and then use .find
    if (Array.isArray(response.data)) {
      const userData = response.data.find((user: User) => user.user_public_key === userAddress);
      if (userData) {
        return userData;
      } else {
        console.log(`User with address ${userAddress} not found.`);
        return null;
      }
    } else {
      console.log("Response data is not an array:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch Lobster points:", error);
    throw error;
  }
};

// Test the function with the provided address
(async () => {
  const userAddress = "0x1222f0baA62e2282Bfd01083C7C3732A8c611584"; // The address to test
  try {
    const points = await fetchLobsterPoints(userAddress);
    if (points) {
      console.log("Lobster Points for the user:", points);
    } else {
      console.log("No data found for the provided address.");
    }
  } catch (error) {
    console.error("Error fetching Lobster Points:", error);
  }
})();
