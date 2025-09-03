import React, { useState, useEffect } from 'react';
import { Button, SafeAreaView, Text, View, NativeModules, NativeEventEmitter } from 'react-native';

const { UhfModule } = NativeModules;
const UhfEvents = new NativeEventEmitter(UhfModule);

export default function App() {
    const [scanning, setScanning] = useState(false);
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        // Initialize reader on mount
        UhfModule.initReader()
            .then(() => console.log('UHF Reader initialized'))
            .catch(console.error);

        // Add event listener to receive scanned tags
        const scanSubscription = UhfEvents.addListener('onTagsScanned', (data: { tags: string[] }) => {
            if (data.tags && Array.isArray(data.tags)) {
                setTags(currentTags => {
                    const newTags = new Set(currentTags);
                    data.tags.forEach(tag => newTags.add(tag));
                    return Array.from(newTags);
                });
            }
        });

        // Cleanup on unmount
        return () => {
            scanSubscription.remove();
            UhfModule.stopScan().catch(console.error);
            UhfModule.closeReader().catch(console.error);
        };
    }, []);

    const toggleScanning = async () => {
        if (scanning) {
            await UhfModule.stopScan();
            setScanning(false);
        } else {
            await UhfModule.startScan();
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
