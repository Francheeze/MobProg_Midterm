import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { loginUser } from "../storage/users";

export default function Login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      Alert.alert("Missing fields", "Please enter your email/username and password.");
      return;
    }

    const user = await loginUser(identifier, password);

    if (!user) {
      Alert.alert("Login failed", "Incorrect email/username or password.");
      return;
    }

    router.replace({
      pathname: "/dashboard",
      params: { username: user.username },
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.appName}>Campus Safety &{"\n"}Incident Reporter</Text>

      <View style={styles.form}>
        <Text style={styles.heading}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          placeholderTextColor="#333"
          autoCapitalize="none"
          value={identifier}
          onChangeText={setIdentifier}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#333"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    paddingTop: 100,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 28,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginTop: 12,
  },
  form: {
    width: "100%",
    paddingHorizontal: 32,
    marginTop: 48,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#D9D9D9",
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 14,
    fontSize: 13,
    // shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    // shadow (Android)
    elevation: 3,
  },
  button: {
    backgroundColor: "#D9D9D9",
    width: 105,
    height: 28,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  buttonText: {
    fontSize: 13,
    color: "#333",
  },
  link: {
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 11,
    color: "#222",
    marginTop: 12,
  },
});