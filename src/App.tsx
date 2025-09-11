import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import HomeScreen from "./screens/Home";
import UhfScannerScreen from "./screens/UhfScanner";
import DetailScreen from "./screens/Detail";

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    UhfScanner: undefined;
    Detail: { id: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                {/*<Stack.Screen name="Register" component={RegisterScreen} />*/}
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="UhfScanner" component={UhfScannerScreen} />
                <Stack.Screen name="Detail" component={DetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
