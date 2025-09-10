import React, { useState, useEffect, useRef } from 'react';
import { Button, SafeAreaView, Text, View, FlatList, NativeModules, NativeEventEmitter, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';

const { UhfModule } = NativeModules;
const UhfEvents = new NativeEventEmitter(UhfModule);

// Beep sound ref
const beepSound = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) console.log('Failed to load beep sound', error);
});

// Tag type with source
type Tag = {
    epc: string;
    source: 'UI' | 'HW';
};

export default function UhfScannerScreen() {
    const [scanning, setScanning] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const scannedTags = useRef<Set<string>>(new Set());

    useEffect(() => {
        UhfModule.initReader()
            .then(() => UhfModule.setPower(10, 10))
            .catch(console.error);

        const subscription = UhfEvents.addListener('onTagsScanned', (data) => {
            if (data?.tags) {
                setTags((prev) => {
                    const newTags: Tag[] = [];
                    data.tags.forEach((epc: string) => {
                        if (!scannedTags.current.has(epc)) {
                            scannedTags.current.add(epc);
                            // Determine source: if scanning via UI button, mark as 'UI', else 'HW'
                            newTags.push({ epc, source: scanning ? 'UI' : 'HW' });
                            // Play beep
                            beepSound.stop(() => {
                                beepSound.play((success) => {
                                    if (!success) console.log('Beep playback failed');
                                });
                            });
                        }
                    });
                    return [...newTags, ...prev];
                });
            }
        });

        return () => subscription.remove();
    }, [scanning]);

    const toggleScanning = async () => {
        if (scanning) {
            await UhfModule.stopScan();
            setScanning(false);
        } else {
            await UhfModule.startScan();
            setScanning(true);
        }
    };

    const clearTags = () => {
        setTags([]);
        scannedTags.current.clear();
    };

    const renderTagItem = ({ item, index }: { item: Tag; index: number }) => (
        <Text
            style={[
                styles.tagItem,
                { backgroundColor: item.source === 'UI' ? 'red' : 'yellow' },
            ]}
        >
            {index + 1}. {item.epc}
        </Text>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>UHF Scanner</Text>
            <Text style={styles.count}>Total Tags Found: {tags.length}</Text>

            <FlatList
                style={styles.list}
                data={tags}
                keyExtractor={(item) => item.epc}
                renderItem={renderTagItem}
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
    tagItem: { fontSize: 16, paddingVertical: 6, paddingHorizontal: 8, marginVertical: 2 },
    buttons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
});
