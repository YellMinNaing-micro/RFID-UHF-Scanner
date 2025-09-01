import React from 'react';
import {Button, SafeAreaView, Text, View} from 'react-native';

import './global.css';

function App(): React.JSX.Element {
  return (
    <SafeAreaView className="flex-1 pt-7">
      <View>
        <Text className="text-red-500">Hello</Text>
      </View>
      <View>
        <Button title="World" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}

export default App;
