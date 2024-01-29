import { useAppState } from "@react-native-community/hooks";
import { useIsFocused } from "@react-navigation/native";
import { View } from "native-base";
import React, { useRef } from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-svg";
import { Camera, useCameraDevice } from "react-native-vision-camera"


function App() {
  return <View><Text>No Camera Device Permission</Text></View>


  // const camera = useRef<Camera>(null)
  // const device = useCameraDevice('back')
  // const isFocused = useIsFocused()
  // const appState = useAppState()
  // const isActive = isFocused && appState === "active"
  
  // if (device == null) return <View><Text>No Camera Device Permission</Text></View>
  // return (
  //   <Camera
  //     ref={camera}
  //     style={StyleSheet.absoluteFill}
  //     device={device}
  //     isActive={isActive}
  //     photo={true}
  //   />
  // )
}

export default App;