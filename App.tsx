import React, { useState, useEffect } from 'react';
import { Button, SafeAreaView, Text, View, FlatList, NativeModules, NativeEventEmitter, StyleSheet } from 'react-native';

const { UhfModule } = NativeModules;
const UhfEvents = new NativeEventEmitter(UhfModule);

export default function App() {
    const [scanning, setScanning] = useState(false);
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        UhfModule.initReader()
            .then(() => UhfModule.setPower(10, 10))
            .catch(console.error);

        // Subscribe to scanned tags
        const subscription = UhfEvents.addListener('onTagsScanned', (data) => {
            if (data?.tags) {
                // Append new tags without duplicates
                setTags((prev) => {
                    const newTags = data.tags.filter((t: string) => !prev.includes(t));
                    return [...prev, ...newTags];
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
