import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

// Define the props interface
interface SpinnerProps {
  visible?: boolean;
  size?: "small" | "large" | number;
  color?: string;
  overlay?: boolean;
  overlayColor?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  visible = false,
  size = "large",
  color = "#0000ff",
  overlay = false,
  overlayColor = "rgba(0,0,0,0.3)",
}) => {
  if (!visible) return null;

  if (overlay) {
    return (
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Centers the spinner
    justifyContent: "center",
    alignItems: "center",
    padding: 10, // Optional: Adds some padding around the spinner
  },
  overlay: {
    // Positions the overlay to cover its parent
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Centers the spinner
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Spinner;
