import axios from "axios"
import { getToken } from "../utils/storage";

export const recentRides = async() => {
    const token = await getToken();
    try{
        const res = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/rides/address`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return res.data;
    }
    catch(error){
        console.error("Recent rides error:", error);
        throw error;
    }
}