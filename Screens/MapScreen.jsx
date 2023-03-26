import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapScreen = ({ navigation, route }) => {
  const { latitude, longitude } = route.params.location;
  const photoName = route.params.photoName;
  return (
    <View style={styles.container}>
      <Text>Map Screen</Text>
      <Text>{latitude}</Text>
      <MapView
        style={styles.mapStyle}
        mapType="standard"
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.06,
        }}
      >
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          title={photoName}
          description="Сфотографовано тут"
          pinColor="#FF6C00"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default MapScreen;
