import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    Button,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Alert,
    NativeEventEmitter,
    NativeModules,
} from "react-native";
import Sound from "react-native-sound";

const { UhfModule } = NativeModules;

interface EPCItem {
    id: string;
    epc: string;
}

export default function UhfScreen() {
    const [epcList, setEpcList] = useState<EPCItem[]>([]);
    const [scanning, setScanning] = useState(false);

    const beepRef = useRef<Sound | null>(null);

    useEffect(() => {
        // Load beep sound
        beepRef.current = new Sound("beep.mp3", Sound.MAIN_BUNDLE, (error) => {
            if (error) console.log("Failed to load beep sound", error);
        });

        const emitter = new NativeEventEmitter(UhfModule);
        const subscription = emitter.addListener("UHF_SCAN", (epc: string) => {
            if (epc) {
                // Play beep
                beepRef.current?.stop(() => {
                    beepRef.current?.play((success) => {
                        if (!success) console.log("Beep failed");
                    });
                });

                setEpcList((prev) => {
                    if (prev.find((item) => item.epc === epc)) return prev; // avoid duplicates
                    return [...prev, { id: `${prev.length + 1}`, epc }];
                });
            }
        });

        // Initialize UHF
        UhfModule.initUhf()
            .then(() => console.log("UHF Initialized"))
            .catch((err: any) => {
                console.error(err);
                Alert.alert("UHF Init Failed", err.message || "Unknown error");
            });

        return () => {
            subscription.remove();
            beepRef.current?.release();
        };
    }, []);

    const startScan = () => {
        UhfModule.startScan();
        setScanning(true);
    };

    const stopScan = () => {
        UhfModule.stopScan();
        setScanning(false);
    };

    const clearScan = () => {
        UhfModule.clearScan();
        setEpcList([]);
    };

    const renderItem = ({ item }: { item: EPCItem }) => (
        <View style={styles.item}>
            <Text style={styles.id}>{item.id}</Text>
            <Text style={styles.epc}>{item.epc}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>UHF Scanner</Text>

            <View style={styles.buttonContainer}>
                <Button title="Start Scan" onPress={startScan} disabled={scanning} />
                <Button title="Stop Scan" onPress={stopScan} disabled={!scanning} />
                <Button title="Clear" onPress={clearScan} />
            </View>

            <FlatList
                data={epcList}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={styles.list}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>No EPC scanned yet</Text>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#f2f2f2" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
    buttonContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
    list: { flex: 1, backgroundColor: "#fff", borderRadius: 8, padding: 8 },
    item: { flexDirection: "row", padding: 8, borderBottomWidth: 1, borderColor: "#eee" },
    id: { width: 30, fontWeight: "bold" },
    epc: { flex: 1 },
    emptyText: { textAlign: "center", marginTop: 16, color: "#999" },
});
