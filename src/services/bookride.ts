import axios from "axios";

export async function bookRide() {
    try{
        const response = await axios.get("www.google.com");
    }
    catch (error) {
        console.error('Error booking ride:', error);
    }
}
