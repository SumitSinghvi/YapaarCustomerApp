import "../global.css";
import React from "react";

import { Slot, SplashScreen } from "expo-router";
import { Provider } from "react-redux";
import store from "~/src/providers/store";
import QueryProvider from "~/src/providers/queryProvider";
import { RootSiblingParent } from "react-native-root-siblings";

import useInitializeSocket from "~/src/hooks/useInitializeSocket";
import { useEffect, useState } from "react";
import { getToken } from "~/src/utils/storage";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";

import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { Platform } from "react-native";

import { PortalHost } from "@rn-primitives/portal";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  //initialize socket
  useInitializeSocket(token);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const theme = await AsyncStorage.getItem("theme");
        if (Platform.OS === "web") {
          document.documentElement.classList.add("bg-background");
        }

        if (!theme) {
          await AsyncStorage.setItem("theme", colorScheme);
        } else {
          const colorTheme = theme === "dark" ? "dark" : "light";
          if (colorTheme !== colorScheme) {
            setColorScheme(colorTheme);
          }
        }

        setIsColorSchemeLoaded(true);
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    const fetchToken = async () => {
      const storedToken = await getToken();
      setToken(storedToken);
    };

    initializeApp();
    fetchToken();
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <Provider store={store}>
          <QueryProvider>
            <RootSiblingParent>
              <Slot />
            </RootSiblingParent>
          </QueryProvider>
        </Provider>
      </ThemeProvider>
      <PortalHost />
    </>
  );
}
