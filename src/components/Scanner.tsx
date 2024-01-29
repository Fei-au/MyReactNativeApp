import { useAppState } from '@react-native-community/hooks';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

function Scanner(){

    return <View><Text>No Camera Device Permission</Text></View>

    // const device = useCameraDevice('back')
    // const isFocused = useIsFocused()
    // const appState = useAppState()
    // const isActive = isFocused && appState === "active"

    // if (device == null) return <View><Text>No Camera Device Permission</Text></View>
    // return (
    //   <Camera
    //     style={StyleSheet.absoluteFill}
    //     device={device}
    //     isActive={isActive}
    //   />
    // )
}


export default Scanner;