import axios from "axios";

export const sendOTP = async (phone: string, name: string) => {
  try {
    const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/send-otp`, {
        phoneNumber: `+91${phone}`,
        name,
        role: "driver",
    })
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return null;
  }
};

export const verifyOTP = async (phone: string, otp: string) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/verify-otp`, {
            phoneNumber: `+91${phone}`,
            role: "driver",
            otp,
        });
        return response.data;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return null;
    }
};