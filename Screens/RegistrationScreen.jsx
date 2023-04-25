import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { authSignUpUser } from "../redux/auth/authOperations";

import { storage } from "../firebase/config";

import SvgAddAvatar from "../assets/svg/addAvatar";

const initialState = {
  login: "",
  email: "",
  password: "",
  avatar: "",
};

export default Registrationscreen = ({ navigation }) => {
  const [state, setState] = useState(initialState);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [focused, setFocused] = useState("");
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
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
        setSelectedImg(result.assets[0].uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  const uploadPhotoToServer = async () => {
    try {
      setLoading(true);
      const response = await fetch(selectedImg);
      const file = await response.blob();
      const uniquePhotoId = Date.now().toString();

      const storageRef = ref(storage, `avatar/${uniquePhotoId}`);
      const result = await uploadBytesResumable(storageRef, file);
      const processedPhoto = await getDownloadURL(storageRef);
      setLoading(false);
      return processedPhoto;
    } catch (error) {
      console.log("error:", error);
    }
  };

  const clearPhoto = () => {
    setSelectedImg(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    console.log("selected img:", selectedImg);

    if (selectedImg) {
      const userAvatar = await uploadPhotoToServer();
      console.log("user avatar:", userAvatar);
      setState((prevState) => ({
        ...prevState,
        avatar: userAvatar,
      }));
      console.log(state);
      dispatch(authSignUpUser(state));
      setState(initialState);
      setLoading(false);
      return;
    }
    dispatch(authSignUpUser(state));
    setState(initialState);
    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.imageBackground}
          source={require("../assets/background.jpg")}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
          >
            <View
              style={{
                ...styles.formContainer,
                paddingBottom: !isShowKeyboard ? 80 : 32,
              }}
            >
              <View style={styles.avatarContainer}>
                {selectedImg ? (
                  <>
                    <Image
                      source={{ uri: selectedImg }}
                      style={styles.avatar}
                    />
                    <TouchableOpacity
                      style={styles.removeAvatar}
                      onPress={clearPhoto}
                    >
                      <SvgAddAvatar />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.addAvatar}
                    onPress={downloadPhoto}
                  >
                    <SvgAddAvatar />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.title}>Реєстрація</Text>

              <View style={{ marginBottom: 16 }}>
                <TextInput
                  placeholder="Логін"
                  value={state.login}
                  onFocus={() => {
                    setIsShowKeyboard(true);
                    Keyboard.isVisible();
                    setFocused("login");
                  }}
                  style={{
                    ...styles.input,
                    borderColor: focused === "login" ? "#FF6C00" : "#E8E8E8",
                  }}
                  onBlur={() => setFocused("")}
                  onChangeText={(value) => {
                    setState((prevState) => ({ ...prevState, login: value }));
                    Keyboard.isVisible();
                  }}
                />
              </View>
              <View style={{ marginBottom: 16 }}>
                <TextInput
                  keyboardType="email-address"
                  placeholder="Адреса електронної пошти"
                  value={state.email}
                  onFocus={() => {
                    setIsShowKeyboard(true);
                    setFocused("email");
                  }}
                  style={{
                    ...styles.input,
                    borderColor: focused === "email" ? "#FF6C00" : "#E8E8E8",
                  }}
                  onBlur={() => setFocused("")}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, email: value }))
                  }
                />
              </View>
              <View style={{ position: "relative" }}>
                <TextInput
                  placeholder="Пароль"
                  value={state.password}
                  onFocus={() => {
                    setIsShowKeyboard(true);
                    setFocused("password");
                  }}
                  style={{
                    ...styles.input,
                    borderColor: focused === "password" ? "#FF6C00" : "#E8E8E8",
                  }}
                  onBlur={() => setFocused("false")}
                  secureTextEntry={isSecureEntry}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, password: value }))
                  }
                />
                <TouchableOpacity
                  style={styles.passwordTextWrapper}
                  onPress={() => {
                    setIsSecureEntry((prevState) => !prevState);
                  }}
                >
                  <Text style={styles.passwordText}>
                    {isSecureEntry ? "Показати" : "Приховати"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.btn}
                onPress={() => {
                  handleSubmit();
                }}
              >
                <Text style={styles.btnTitle}>Зареєструватися</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.signinText}>Уже є аккаунт? Увійти</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  avatarContainer: {
    position: "absolute",
    left: "37%",
    top: -60,
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 10,
  },
  addAvatar: {
    position: "absolute",
    left: "85%",
    top: "65%",
  },
  removeAvatar: {
    position: "absolute",
    left: "85%",
    top: "65%",
    transform: [{ rotate: "45deg" }],
  },
  avatar: {
    maxWidth: "100%",
    borderRadius: 10,
    height: 120,
    width: "100%",
    resizeMode: "cover",
  },
  formContainer: {
    paddingTop: 92,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {
    fontFamily: "Roboto-Regular",
    textAlign: "center",
    fontWeight: 500,
    fontSize: 30,
    marginBottom: 33,
  },
  input: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    height: 50,
    color: "#212121",
    backgroundColor: "#F6F6F6",
    fontSize: 16,
    padding: 16,
  },
  passwordTextWrapper: {
    position: "absolute",
    top: "30%",
    right: 25,
  },
  passwordText: {
    color: "#1B4371",
    fontSize: 16,
    lineHeight: 19,
  },
  btn: {
    height: 50,
    marginHorizontal: 16,
    marginTop: 43,
    marginBottom: 16,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6C00",
  },
  btnTitle: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  signinText: {
    color: "#1B4371",
    fontSize: 18,
    textAlign: "center",
  },
});
