import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import { View, Button } from "react-native";

import SvgCamera from "../assets/svg/cameraIcon";

const StackSettings = ({ navigation }) => {
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
    })();
  }, []);

  const makePhoto = async () => {
    const photo = await cameraRef.current.takePictureAsync();
    setPhoto(photo.uri);
    console.log("photo :>> ", photo);
    await MediaLibrary.createAssetAsync(photo.uri);
  };

  //  const takePhoto = async () => {
  //   const photo = await camera.takePictureAsync();
  //   setPhoto(photo.uri);
  // };

  const clearPost = () => {
    setPhotoName("");
    setPhotoLocation("");
  };

  // const __startCamera = async () => {
  //   const { status } = await Camera.requestCameraPermissionsAsync();
  //   if (status === "granted") {
  //     setStartCamera(true);
  //   } else {
  //     Alert.alert("Access denied");
  //   }
  // };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        {startCamera ? (
          <>
            <Camera style={styles.camera} ref={cameraRef}>
              <TouchableOpacity style={styles.cameraIcon} onPress={makePhoto}>
                <SvgCamera />
              </TouchableOpacity>
            </Camera>
            <KeyboardAvoidingView
              behavior={Platform.OS == "ios" ? "padding" : ""}
            >
              <View style={styles.form}>
                <TextInput
                  placeholder="Назва..."
                  style={styles.input}
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
                  clearPost();
                  navigation.navigate("Posts");
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
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              // onPress={__startCamera}
              style={{
                width: 130,
                borderRadius: 4,
                backgroundColor: "#14274e",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: 40,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Take picture
              </Text>
            </TouchableOpacity>
          </View>
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
  cameraIcon: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    marginTop: 48,
    marginHorizontal: 16,
  },
  input: {
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
    fontSize: 16,
  },
});

export default StackSettings;

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
