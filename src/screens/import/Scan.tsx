import { Icon } from '@ant-design/react-native';
import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

function Scan(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={{backgroundColor: backgroundStyle.backgroundColor, minHeight: '100%'}}>
      {/* Scan button container */}
      
    </View>
  );
}

const styles = StyleSheet.create({
});

export default Scan;
