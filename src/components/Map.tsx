import MapView, { Marker } from "react-native-maps";

const Map = ({
  location,
}: {
  location: { latitude: number; longitude: number };
}) => {
  return (
    <MapView
      style={{ flex: 1 }}
      mapType="mutedStandard"
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      }}
    >
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        title="Drop Location"
        description="This is the drop location"
        identifier="drop"
      />
    </MapView>
  );
};

export default Map;
