import { Slot } from "expo-router";
import { Provider } from "react-redux";
import store from "@/src/providers/store";
import QueryProvider from "@/src/providers/queryProvider";
import { RootSiblingParent } from "react-native-root-siblings";

// Import your global CSS file
import "../global.css";
import useInitializeSocket from "@/src/hooks/useInitializeSocket";
import { useEffect, useState } from "react";
import { getToken } from "@/src/utils/storage";

export default function Layout() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Fetch token from AsyncStorage
    const fetchToken = async () => {
      const storedToken = await getToken();
      setToken(storedToken);
    };
    
    fetchToken();
  }, []);

  // Initialize socket only when token is available
  useInitializeSocket(token);
  
  return (
      <Provider store={store}>
        <QueryProvider>
          <RootSiblingParent>
            <Slot />
          </RootSiblingParent>
        </QueryProvider>
      </Provider>
  );
}
