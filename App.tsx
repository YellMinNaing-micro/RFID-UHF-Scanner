import React, { useState, useEffect } from 'react';
import { Button, SafeAreaView, Text, View, FlatList, NativeModules, NativeEventEmitter, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';

const { UhfModule } = NativeModules;
const UhfEvents = new NativeEventEmitter(UhfModule);

// Load beep sound from Android res/raw folder (Hermes-compatible)
const beepSound = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('Failed to load beep sound', error);
    }
});

export default function App() {
    const [scanning, setScanning] = useState(false);
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        UhfModule.initReader()
            .then(() => UhfModule.setPower(10, 10))
            .catch(console.error);

        const subscription = UhfEvents.addListener('onTagsScanned', (data) => {
            if (data?.tags) {
                setTags((prev) => {
                    const newTags = data.tags.filter((t: string) => !prev.includes(t));
                    if (newTags.length > 0) {
                        // Play beep for each new tag scanned
                        beepSound.stop(() => {
                            beepSound.play((success) => {
                                if (!success) console.log('Beep playback failed');
                            });
                        });
                    }
                    return [...newTags, ...prev];
                });
            }
        });

        return () => subscription.remove();
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
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>UHF Scanner</Text>
            <Text style={styles.count}>Total Tags Found: {tags.length}</Text>

            <FlatList
                style={styles.list}
                data={tags}
                keyExtractor={(item) => item}
                renderItem={({ item, index }) => (
                    <Text style={styles.tagItem}>{index + 1}. {item}</Text>
                )}
            />

            <View style={styles.buttons}>
                <Button title={scanning ? 'Stop' : 'Start'} onPress={toggleScanning} />
                <Button title="Clear" onPress={clearTags} color="red" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    count: { fontSize: 18, color: 'blue', marginBottom: 10, textAlign: 'center' },
    list: { flex: 1, marginBottom: 20 },
    tagItem: { fontSize: 16, paddingVertical: 4 },
    buttons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
});
