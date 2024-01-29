import { useIsFocused } from '@react-navigation/core';
import { Text } from 'react-native';
import { RNCamera } from 'react-native-camera';


interface ComponentProps {
    hasCameraPermission: boolean; // Optional prop
}

export const Component: React.FC<ComponentProps> = (props) => {
  const isFocused = useIsFocused();
    const {hasCameraPermission} = props;
  // ...

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  } else if (hasCameraPermission !== null && isFocused) {
    return <RNCamera />;
  } else {
    return null;
  }
}