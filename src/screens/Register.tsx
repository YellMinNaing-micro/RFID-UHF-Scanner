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

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, "Register">;

const RegisterScreen = ({ navigation }: { navigation: RegisterScreenNavigationProp }) => {
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = () => {
        if (!username || !email || !password) {
            Alert.alert("Error", "Please fill all fields!");
            return;
        }
        Alert.alert("Success", "Account created successfully!");
        navigation.replace("Login"); // replace so back button won't go back to register
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
                        <Text style={styles.title}>Sign Up</Text>
                        <Text style={styles.subtitle}>Start Your Journey.</Text>

                        <Text style={styles.label}>User Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="User name"
                            value={username}
                            onChangeText={setUsername}
                        />

                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Full name"
                            value={fullName}
                            onChangeText={setFullName}
                        />

                        <Text style={styles.label}>Email address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
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

                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.signInContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.signInText}>
                                Already have an account? <Text style={styles.signInLink}>Sign In</Text>
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
        marginTop: 10,
    },
    buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
    signInContainer: { padding: 32, width: "90%", alignItems: "center" },
    signInText: { fontSize: 14, color: "#007AFF" },
    signInLink: { fontWeight: "bold" },
});

export default RegisterScreen;
