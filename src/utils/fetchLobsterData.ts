import axios from "axios";

// Define the type for a user object
interface User {
  user_public_key: string;
  user_detailed_points: any[]; // Adjust this type if you know the exact structure
  user_points: number;
}

// Base URL of the Lobster API
const LOBSTER_API_BASE_URL = "https://api.prod.lobster-protocol.com/v1/users/leaderboard/";

// Function to fetch Lobster points for a specific user address
export const fetchLobsterPoints = async (userAddress: string): Promise<User | null> => {
  try {
    const response = await axios.get(LOBSTER_API_BASE_URL);

    // Ensure the response data is an array, then filter for the specific user
    if (response.data.leaderboard) {
      return response.data.leaderboard.find((user: User) => user.user_public_key === userAddress) || null;
    } else {
      console.warn("Unexpected data format received from the Lobster API");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch Lobster points:", error);
    throw error;
  }
};
