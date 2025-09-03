import React, { useState, useRef, useEffect } from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { NativeModules } from 'react-native';

const { UhfModule } = NativeModules;

export default function App() {
    const [scanning, setScanning] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        // Initialize reader on mount
        UhfModule.initReader()
            .then(() => console.log('UHF Reader initialized'))
            .catch(console.error);

        return () => {
            // Cleanup on unmount
            if (intervalRef.current !== null) clearInterval(intervalRef.current);
            UhfModule.stopScan().catch(console.error);
            UhfModule.closeReader().catch(console.error);
        };
    }, []);

    const toggleScanning = async () => {
        if (scanning) {
            // Stop scanning
            if (intervalRef.current !== null) clearInterval(intervalRef.current);
            intervalRef.current = null;
            await UhfModule.stopScan().catch(console.error);
            setScanning(false);
        } else {
            // Start scanning
            await UhfModule.startScan().catch(console.error);
            intervalRef.current = setInterval(async () => {
                try {
                    const scannedTags: string[] = await UhfModule.startScan();
                    setTags(scannedTags);
                } catch (e) {
                    console.error('UHF scan error:', e);
                }
            }, 500) as unknown as number; // Type assertion for RN
            setScanning(true);
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
                <Button title={scanning ? 'Stop' : 'Start'} onPress={toggleScanning} />
            </View>

            <View>
                <Button title="Clear" onPress={clearTags} color="red" />
            </View>
        </SafeAreaView>
    );
}
