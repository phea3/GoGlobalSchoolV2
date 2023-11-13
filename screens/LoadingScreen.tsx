import { Image, ImageBackground, View } from "react-native";

export default function LoadingScreen() {
  return (
    <ImageBackground
      source={require("../assets/Images/dashboard-login.png")}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/Images/Logo.png")}
        style={{ width: 100, height: 100 }}
        resizeMode="contain"
      />
    </ImageBackground>
  );
}
