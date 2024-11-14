// import { getToken } from "~/src/utils/asyncStorage";

// export const postQuery = async (phoneNumber: string) => {
//   const token = await getToken();
//   try {
//     const res = await fetch(
//       `${process.env.EXPO_PUBLIC_BACKEND_URL}/q/customer-queries`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token && { Authorization: token }),
//         },
//         body: JSON.stringify({
//           customerId: "6714b62cf75abcf25d156b83",
//           phoneNumber,
//         }),
//       }
//     );

//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error("Query error:", error);
//     throw error;
//   }
// };

// export const getQueries = async (id: string) => {
//   const token = await getToken();
//   try {
//     const res = await fetch(
//       `${process.env.EXPO_PUBLIC_BACKEND_URL}/q/customer-queries/${id}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token && { Authorization: token }),
//         },
//       }
//     );

//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error("Query error:", error);
//     throw error;
//   }
// };
