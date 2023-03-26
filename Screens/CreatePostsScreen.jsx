import {
  View,
  KeyboardAvoidingView,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState, useRef } from "react";
import { Camera } from "expo-camera";

import SvgCamera from "../assets/svg/cameraIcon";

const CreatePostsScreen = ({ navigation }) => {
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);
  const [hasImagePickerPermission, setImagePickerPermission] = useState(null);
  const [haslocationPermission, setLocationPermission] = useState(null);

  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [photoLocation, setPhotoLocation] = useState("");
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [location, setLocation] = useState(null);
  const [startCamera, setStartCamera] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setStartCamera(true);
      } else {
        Alert.alert("Access denied");
      }
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      const locationPermission =
        await Location.requestForegroundPermissionsAsync();
      if (Platform.OS !== "web") {
        const imagePickerPermission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        setImagePickerPermission(imagePickerPermission.status === "granted");
      }

      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
      setLocationPermission(locationPermission.status === "granted");

      const location = await Location.getCurrentPositionAsync();
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const makePhoto = async () => {
    const photo = await cameraRef.current.takePictureAsync();
    setPhoto(photo.uri);
    await MediaLibrary.createAssetAsync(photo.uri);
  };

  const downloadPhoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  const clearPhoto = () => {
    setPhoto("");
  };

  const clearPost = () => {
    setPhotoName("");
    setPhotoLocation("");
    clearPhoto();
  };

  const postPhoto = async () => {
    navigation.navigate("Posts", { photo, photoName, photoLocation, location });
  };

  // const __startCamera = async () => {
  //   const { status } = await Camera.requestCameraPermissionsAsync();
  //   if (status === "granted") {
  //     setStartCamera(true);
  //   } else {
  //     Alert.alert("Access denied");
  //   }
  // };

  if (hasMediaLibraryPermission === false) {
    return <Text>Немає доступу до галереї</Text>;
  }

  if (hasImagePickerPermission === false) {
    return <Text>Немає доступу до галереї</Text>;
  }

  if (haslocationPermission === false) {
    return <Text>Немає доступу до геолокації</Text>;
  }

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View
        style={{
          ...styles.container,
          paddingBottom: !isShowKeyboard ? 80 : 32,
        }}
      >
        {startCamera ? (
          <>
            {photo ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.takenPhoto} />
              </View>
            ) : (
              <Camera style={styles.camera} ref={cameraRef}>
                <TouchableOpacity style={styles.cameraIcon} onPress={makePhoto}>
                  <SvgCamera />
                </TouchableOpacity>
              </Camera>
            )}
            {photo ? (
              <TouchableOpacity onPress={clearPhoto}>
                <Text style={styles.editor}>Спробувати ще раз</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={downloadPhoto}>
                <Text style={styles.editor}>Завантажити фото</Text>
              </TouchableOpacity>
            )}

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : ""}
            >
              <View
                style={{
                  ...styles.form,
                }}
              >
                <TextInput
                  placeholder="Назва..."
                  style={styles.input}
                  onFocus={() => {
                    setIsShowKeyboard(true);
                    Keyboard.isVisible();
                  }}
                  onChangeText={(value) => {
                    setPhotoName(value);
                  }}
                  value={photoName}
                />

                <TextInput
                  placeholder="Локація..."
                  style={{ ...styles.input, marginTop: 32 }}
                  onChangeText={(value) => {
                    setPhotoLocation(value);
                  }}
                  value={photoLocation}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  ...styles.btn,
                  backgroundColor: photoName ? "#FF6C00" : "#F6F6F6",
                }}
                onPress={() => {
                  postPhoto();
                  clearPost();
                }}
              >
                <Text
                  style={{
                    ...styles.btnTitle,
                    color: photoName ? "#fff" : "#BDBDBD",
                  }}
                >
                  Опублікувати
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </>
        ) : (
          <Text>Немає доступу до камери</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  camera: {
    marginHorizontal: 16,
    marginTop: 32,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  photoContainer: {
    marginHorizontal: 16,
  },
  takenPhoto: {
    marginRight: 16,
    maxWidth: "100%",
    borderRadius: 10,
    marginTop: 32,
    height: 240,
    width: "100%",
    resizeMode: "cover",
  },
  cameraIcon: {
    width: 60,
    height: 60,
    opacity: 10,
    borderRadius: "50%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  editor: {
    fontFamily: "Roboto-Regular",
    color: "#BDBDBD",
    fontSize: 16,
    marginHorizontal: 16,
    padding: 10,
    marginTop: 8,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#FF6C00",
    borderRadius: 10,
  },
  form: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  input: {
    fontFamily: "Roboto-Regular",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
  },
  btn: {
    height: 50,
    marginHorizontal: 16,
    marginTop: 43,
    marginBottom: 16,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTitle: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
});

export default CreatePostsScreen;
