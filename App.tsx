import React, { useState, useRef, useEffect } from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { NativeModules } from 'react-native';

const { UhfModule } = NativeModules;

export default function App() {
    const [scanning, setScanning] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        UhfModule.initReader().catch(console.error);

        return () => {
            if (intervalRef.current !== null) clearInterval(intervalRef.current);
            UhfModule.closeReader().catch(console.error);
        };
    }, []);

    const startScanning = async () => {
        try {
            const scannedTags: string[] = await UhfModule.readAllTags();
            setTags(scannedTags);
        } catch (e) {
            console.error('UHF scan error:', e);
        }
    };


    const clearTags = () => setTags([]);

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 40, alignItems: 'center' }}>
            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>UHF Scanner</Text>
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, color: 'blue' }}>
                    Scanned Tags: {tags.length > 0 ? tags.join(', ') : 'None'}
                </Text>
            </View>

            <View style={{ marginBottom: 20 }}>
                <Button title={scanning ? 'Stop' : 'Start'} onPress={startScanning} />
            </View>

            <View>
                <Button title="Clear" onPress={clearTags} color="red" />
            </View>
        </SafeAreaView>
    );
}
