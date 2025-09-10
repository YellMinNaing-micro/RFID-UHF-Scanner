import React, { useState, useEffect, useRef } from 'react';
import { Button, SafeAreaView, Text, View, FlatList, NativeModules, NativeEventEmitter, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';

const { UhfModule } = NativeModules;
const UhfEvents = new NativeEventEmitter(UhfModule);

type Tag = {
    epc: string;
    source: 'UI' | 'HW';
};

export default function UhfScannerScreen() {
    const [scanning, setScanning] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const beepRef = useRef<Sound | null>(null);

    useEffect(() => {
        beepRef.current = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) console.log('Failed to load beep sound', error);
        });

        UhfModule.initReader()
            .then(() => UhfModule.setPower(10, 10))
            .catch(console.error);

        const subscription = UhfEvents.addListener('onTagsScanned', (data) => {
            if (data?.tags && data?.sources) {
                setTags((prev) => {
                    const newItems: Tag[] = [];
                    for (let i = 0; i < data.tags.length; i++) {
                        const epc = data.tags[i];
                        const source = data.sources[i];
                        if (!prev.some(t => t.epc === epc)) {
                            newItems.push({ epc, source });
                        }
                    }
                    if (newItems.length > 0 && beepRef.current) {
                        beepRef.current.stop(() => {
                            beepRef.current?.play(success => {
                                if (!success) console.log('Beep playback failed');
                            });
                        });
                    }
                    return [...newItems, ...prev];
                });
            }
        });

        return () => {
            subscription.remove();
            beepRef.current?.release();
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

    const renderTagItem = ({ item, index }: { item: Tag; index: number }) => (
        <Text
            style={[
                styles.tagItem,
                item.source === 'HW' ? styles.hwTag : styles.uiTag,
            ]}
        >
            {index + 1}. {item.epc} ({item.source})
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
    tagItem: { fontSize: 16, paddingVertical: 6, paddingHorizontal: 8, marginVertical: 2, borderRadius: 6 },
    hwTag: { backgroundColor: 'red', color: 'white' },
    uiTag: { backgroundColor: 'yellow', color: 'black' },
    buttons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
});
