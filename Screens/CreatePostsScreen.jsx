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
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Camera } from "expo-camera";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

import { storage, db } from "../firebase/config";

import SvgCamera from "../assets/svg/cameraIcon";

const CreatePostsScreen = ({ navigation }) => {
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);
  const [hasImagePickerPermission, setImagePickerPermission] = useState(null);
  const [haslocationPermission, setLocationPermission] = useState(null);

  const [newPhoto, setNewPhoto] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [photoLocation, setPhotoLocation] = useState("");
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [location, setLocation] = useState(null);
  const [startCamera, setStartCamera] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [loading, setLoading] = useState(false);

  const { nickname, userId } = useSelector((state) => state.auth);

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
    })();
  }, []);

  const makePhoto = async () => {
    const photo = await cameraRef.current.takePictureAsync();
    setNewPhoto(photo.uri);
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
        setNewPhoto(result.assets[0].uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  const uploadPhotoToServer = async () => {
    try {
      setLoading(true);
      const response = await fetch(newPhoto);
      const file = await response.blob();
      const uniquePhotoId = Date.now().toString();

      const storageRef = ref(storage, `postImage/${uniquePhotoId}`);
      const result = await uploadBytesResumable(storageRef, file);
      const processedPhoto = await getDownloadURL(result.ref);
      return processedPhoto;
      setLoading(false);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const uploadPostToServer = async () => {
    let locationRes;
    setLoading(true);
    const photo = await uploadPhotoToServer();
    console.log(photo);
    try {
      locationRes = await Location.getCurrentPositionAsync({});
    } catch (error) {
      console.log("error:", error);
    }
    if (!locationRes) {
      locationRes = { coords: { latitude: 0, longitude: 0 } };
    }
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        photo,
        description: photoName,
        place: photoLocation,
        userId,
        nickname,
        location: {
          latitude: locationRes.coords.latitude,
          longitude: locationRes.coords.longitude,
        },
        createdAt: Date.now().toString(),
      });
    } catch (error) {
      console.log("error:", error);
    }
    setLoading(false);
  };

  const clearPhoto = () => {
    setNewPhoto("");
  };

  const clearPost = () => {
    setPhotoName("");
    setPhotoLocation("");
    clearPhoto();
  };

  const postPhoto = async () => {
    if (newPhoto && photoName && photoLocation) {
      await uploadPostToServer();
      navigation.navigate("Posts");
    }
  };

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
        }}
      >
        {loading && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" color="#FF6C00" />
          </View>
        )}
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
          <View
            style={{
              paddingBottom: !isShowKeyboard ? 10 : 32,
            }}
          >
            {startCamera ? (
              <>
                {newPhoto ? (
                  <View style={styles.photoContainer}>
                    <Image
                      source={{ uri: newPhoto }}
                      style={styles.takenPhoto}
                    />
                  </View>
                ) : (
                  <Camera style={styles.camera} ref={cameraRef}>
                    <TouchableOpacity
                      style={styles.cameraIcon}
                      onPress={makePhoto}
                    >
                      <SvgCamera />
                    </TouchableOpacity>
                  </Camera>
                )}
                {newPhoto ? (
                  <TouchableOpacity onPress={clearPhoto}>
                    <Text style={styles.editor}>Спробувати ще раз</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={downloadPhoto}>
                    <Text style={styles.editor}>Завантажити фото</Text>
                  </TouchableOpacity>
                )}

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
              </>
            ) : (
              <Text>Немає доступу до камери</Text>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  camera: {
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 10,
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
  activityIndicatorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 9,
  },
});

export default CreatePostsScreen;
