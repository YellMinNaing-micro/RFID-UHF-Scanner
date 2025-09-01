import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { readTag, writeTag } from "../services/uhfServices.ts";

export default function UHFScreen() {
    const [tag, setTag] = useState<string>("");

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button
                title="Read UHF Tag"
                onPress={async () => {
                    try {
                        const t = await readTag();
                        setTag(t);
                    } catch (e) {
                        console.error(e);
                    }
                }}
            />
            <Text>Tag: {tag}</Text>

            <Button
                title="Write UHF Tag"
                onPress={async () => {
                    try {
                        const result = await writeTag("MY_NEW_TAG");
                        console.log(result);
                    } catch (e) {
                        console.error(e);
                    }
                }}
            />
        </View>
    );
}
