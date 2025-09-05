import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StatusBar,
    Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

Ionicons.loadFont();

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

const LoginScreen = ({ navigation }: { navigation: LoginScreenNavigationProp }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        if (username === "user" && password === "Password@123") {
            Alert.alert("Success", "Logged in successfully!");
            navigation.replace("Home"); // replace so back button won't go back to login
        } else {
            Alert.alert("Error", "Invalid credentials!");
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <StatusBar barStyle="dark-content" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.content}>
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Log In</Text>
                        <Text style={styles.subtitle}>Enter, Explore & Enjoy</Text>

                        <Text style={styles.label}>User Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                        />

                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Log In</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.signUpContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                            <Text style={styles.signUpText}>
                                Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    formContainer: { width: "90%", gap: 16 },
    title: { fontSize: 32, fontWeight: "bold", color: "black" },
    subtitle: { fontSize: 16, color: "gray" },
    label: { fontSize: 16, color: "black" },
    input: {
        height: 50,
        width: "100%",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
    },
    passwordInputContainer: { width: "100%", justifyContent: "center" },
    icon: { position: "absolute", right: 15, alignSelf: "center" },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#007AFF",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
    signUpContainer: { padding: 32, width: "90%", alignItems: "center" },
    signUpText: { fontSize: 14, color: "#007AFF" },
    signUpLink: { fontWeight: "bold" },
});

export default LoginScreen;
