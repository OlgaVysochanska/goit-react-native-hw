import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const initialState = {
  login: "",
  email: "",
  password: "",
};

export default Registrationscreen = () => {
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  const [state, setState] = useState(initialState);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [focused, setFocused] = useState("");

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    console.log(state);
    setState(initialState);
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container} onLayout={onLayoutRootView}>
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
                paddingBottom: !isShowKeyboard ? 80 : 12,
              }}
            >
              <Text style={styles.title}>Реєстрація</Text>

              <View style={{ marginBottom: 16 }}>
                <TextInput
                  placeholder="Логін"
                  value={state.value}
                  onFocus={() => {
                    setIsShowKeyboard(true);
                    setFocused("login");
                  }}
                  style={{
                    ...styles.input,
                    borderColor: focused === "login" ? "#FF6C00" : "#E8E8E8",
                  }}
                  onBlur={() => setFocused("")}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, login: value }))
                  }
                />
              </View>
              <View style={{ marginBottom: 16 }}>
                <TextInput
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
              <View style={{ marginBottom: 16, position: "relative" }}>
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
                  secureTextEntry={true}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, password: value }))
                  }
                />
                <Text style={styles.passwordText}>Показати</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.btn}
                onPress={handleSubmit}
              >
                <Text style={styles.btnTitle}>Зареєструватися</Text>
              </TouchableOpacity>
              <Text style={styles.signinText}>Уже є аккаунт? Увійти</Text>
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
  passwordText: {
    position: "absolute",
    top: "30%",
    left: "75%",
    color: "#1B4371",
    fontSize: 16,
    lineHeight: 19,
  },
  btn: {
    height: 50,
    marginHorizontal: 16,
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
