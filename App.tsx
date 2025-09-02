import { JSX, useState } from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { NativeModules } from 'react-native';
import './global.css';
import React = require("react");

const {UhfModule} = NativeModules;

function App(): JSX.Element {
    const [scanning, setScanning] = useState(false); // Is scanning active?
    const [tags, setTags] = useState<string[]>([]);  // Array of scanned tags
    const [intervalId, setIntervalId] = useState<number | null>(null);

    const startScanning = () => {
        if (scanning) {
            // Stop scanning
            if (intervalId !== null) {
                clearInterval(intervalId);
            }
            setScanning(false);
            setIntervalId(null);
        } else {
            // Start scanning every 500ms
            const id = setInterval(async () => {
                try {
                    // readAllTags returns an array of strings
                    const scannedTags: string[] = await UhfModule.readAllTags();
                    setTags(scannedTags);
                } catch (e) {
                    console.error('UHF scan error:', e);
                }
            }, 500);
            // In React Native, setInterval returns a number
            setIntervalId(id as unknown as number);
            setScanning(true);
        }
    };

    const clearTags = () => setTags([]);

    return (
        <SafeAreaView className="flex-1 pt-7 items-center">
            <View className="mb-4">
                <Text className="text-xl font-bold">UHF Scanner</Text>
            </View>

            <View className="mb-4">
                <Text className="text-lg text-blue-600">
                    Scanned Tags: {tags.length > 0 ? tags.join(', ') : 'None'}
                </Text>
            </View>

            <View className="mb-4">
                <Button
                    title={scanning ? 'Stop' : 'Start'}
                    onPress={startScanning}
                />
            </View>

            <View>
                <Button title="Clear" onPress={clearTags} color="red"/>
            </View>
        </SafeAreaView>
    );
}

export default App;
