import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import { View, Button } from "react-native";

import SvgCamera from "../assets/svg/cameraIcon";

const CreatePostsScreen = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);
  const [hasImagePickerPermission, setImagePickerPermission] = useState(null);
  const [haslocationPermission, setLocationPermission] = useState(null);

  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [photoLocation, setPhotoLocation] = useState("");
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [startCamera, setStartCamera] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const cameraRef = useRef();

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }
  //     const location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   })();
  // }, []);

  // let text = "Waiting..";
  // if (errorMsg) {
  //   text = errorMsg;
  // } else if (location) {
  //   text = JSON.stringify(location);
  // }

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
    console.log("photo :>> ", photo);
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
        setDataImage(result.assets[0].uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  //  const takePhoto = async () => {
  //   const photo = await camera.takePictureAsync();
  //   setPhoto(photo.uri);
  // };

  const clearPost = () => {
    setPhotoName("");
    setPhotoLocation("");
  };

  const clearPhoto = () => {
    setPhoto("");
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

  if (hasCameraPermission === false) {
    return <Text>Нема доступу до камери</Text>;
  }

  if (hasMediaLibraryPermission === false) {
    return <Text>Нема доступу до галереї</Text>;
  }

  if (hasImagePickerPermission === false) {
    return <Text>Нема доступу до галереї</Text>;
  }

  if (haslocationPermission === false) {
    return <Text>Нема доступу до геолокації</Text>;
  }

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View
        style={{
          ...styles.container,
          paddingBottom: !isShowKeyboard ? 80 : 32,
        }}
      >
        <>
          {photo ? (
            <>
              <Image source={{ uri: photo }} style={styles.takenPhoto} />
              <TouchableOpacity onPress={clearPhoto}>
                <Text style={styles.editor}>Зробити нове фото</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Camera style={styles.camera} ref={cameraRef}>
                <TouchableOpacity style={styles.cameraIcon} onPress={makePhoto}>
                  <SvgCamera />
                </TouchableOpacity>
              </Camera>
              <TouchableOpacity onPress={downloadPhoto}>
                <Text style={styles.editor}>Завантажити фото</Text>
              </TouchableOpacity>
            </>
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
  takenPhoto: {
    marginHorizontal: 16,
    marginTop: 32,
    height: 240,
    width: "100%",
    resizeMode: "cover",
  },
  cameraIcon: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  editor: {
    fontFamily: "Roboto-Regular",
    color: "#BDBDBD",
    fontSize: 16,
    padding: 10,
    marginTop: 8,
    marginLeft: 16,
    borderWidth: 1,
    borderColor: "#FF6C00",
    borderRadius: 100,
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

// import React, { useState } from "react";
// import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
// import { Camera, CameraType } from "expo-camera";

// const CreatePostsScreen = () => {
//   const [camera, setCamera] = useState(null);
//   const [photo, setPhoto] = useState(null);
//   const [type, setType] = useState(CameraType.back);

//   const takePhoto = async () => {
//     const photo = await camera.takePictureAsync();
//     setPhoto(photo.uri);
//   };

//   function toggleCameraType() {
//     setType((current) =>
//       current === CameraType.back ? CameraType.front : CameraType.back
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Camera style={styles.camera} ref={setCamera} type={type}>
//         {photo && (
//           <View>
//             <Image source={{ uri: photo }} />
//           </View>
//         )}
//       </Camera>
//       <TouchableOpacity onPress={takePhoto} style={styles.snapContainer}>
//         <Text style={styles.snap}>Take photo!!!</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={{ backgroundColor: "#000" }}
//         onPress={toggleCameraType}
//       >
//         <Text style={{ color: "#000" }}>Flip Camera</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   camera: {
//     height: "70%",
//     marginHorizontal: 2,
//     marginTop: 40,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "flex-end",
//   },
//   snap: {
//     color: "#fff",
//   },
//   snapContainer: {
//     borderWidth: 1,
//     borderColor: "#ff0000",
//     width: 70,
//     height: 70,
//     borderRadius: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//   },
// });

// export default CreatePostsScreen;
