import React, { useState, useEffect } from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { NativeModules } from 'react-native';
import './global.css';

const {UhfModule} = NativeModules;

function App(): React.JSX.Element {
    const [scanning, setScanning] = useState(false); // Is scanning active?
    const [tag, setTag] = useState<string>('');      // Current scanned tag
    const [intervalId, setIntervalId] = useState<number | null>(null);

    const startScanning = () => {
        if (scanning) {
            // Stop scanning
            if (intervalId !== null) clearInterval(intervalId);
            setScanning(false);
            setIntervalId(null);
        } else {
            // Start scanning every 500ms
            const id = setInterval(async () => {
                try {
                    const t = await UhfModule.readTag();
                    setTag(t);
                } catch (e) {
                    console.error(e);
                }
            }, 500);
            setIntervalId(id); // id is a number in React Native
            setScanning(true);
        }
    };

    const clearTag = () => {
        setTag('');
    };

    return (
        <SafeAreaView className="flex-1 pt-7 items-center">
            <View className="mb-4">
                <Text className="text-xl font-bold">UHF Scanner</Text>
            </View>

            <View className="mb-4">
                <Text className="text-lg text-blue-600">Scanned Tag: {tag}</Text>
            </View>

            <View className="mb-4">
                <Button
                    title={scanning ? 'Stop' : 'Start'}
                    onPress={startScanning}
                />
            </View>

            <View>
                <Button title="Clear" onPress={clearTag} color="red"/>
            </View>
        </SafeAreaView>
    );
}

export default App;
