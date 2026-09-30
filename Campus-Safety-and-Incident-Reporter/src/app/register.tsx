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
import { registerUser } from "../storage/users";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const cleanEmail = email.trim();
    const cleanUsername = username.trim();

    if (!cleanEmail || !cleanUsername || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }

    // Must look like name@domain.com
    const emailPattern = /^[^\s@]+@[^\s@]+$/;
    if (!emailPattern.test(cleanEmail)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }

    const error = await registerUser({
      email: cleanEmail,
      username: cleanUsername,
      password,
    });

    if (error) {
      Alert.alert("Registration failed", error);
      return;
    }

    Alert.alert("Success", "Account created! You can now log in.");
    router.replace("/login");
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
        <Text style={styles.heading}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#333"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#333"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#333"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.link}>Already have an account?</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
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