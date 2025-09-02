import React, { useState, useRef, useEffect, JSX } from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { NativeModules } from 'react-native';

const { UhfModule } = NativeModules;

export default function App(): JSX.Element {
    const [scanning, setScanning] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [readerReady, setReaderReady] = useState(false);
    const intervalRef = useRef<number | null>(null);

    /** Start scanning (initialize if needed) */
    const startScanning = async () => {
        if (!readerReady) {
            // initialize reader only when first pressing Start
            try {
                await UhfModule.initReader();
                setReaderReady(true);
                console.log('UHF reader initialized');
            } catch (e) {
                console.error('UHF init failed:', e);
                return; // do not start scanning if init fails
            }
        }

        if (scanning) {
            // Stop scanning
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setScanning(false);
        } else {
            // Start scanning loop
            intervalRef.current = setInterval(async () => {
                try {
                    const scannedTags: string[] = await UhfModule.readAllTags();
                    setTags(scannedTags);
                } catch (e) {
                    console.error('UHF scan error:', e);
                }
            }, 500) as unknown as number;

            setScanning(true);
        }
    };

    /** Clear tags list */
    const clearTags = () => setTags([]);

    /** Cleanup on unmount */
    useEffect(() => {
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (readerReady) UhfModule.closeReader().catch(console.error);
        };
    }, [readerReady]);

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
