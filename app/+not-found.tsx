import { Link } from "expo-router";
import { Text } from "react-native";

export default function PlusNotFound() {
  return (
    <Link href="/" className="flex-1 pt-80 h-screen text-center bg-black text-white">
      <Text>GO to Home</Text>
    </Link>
  );
}
