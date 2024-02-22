/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/auth/login';
import Home from './src/screens/';
import ItemEditor from './src/screens/import/ItemEditor';
import PermissionsPage from './src/screens/auth/PermissionsPage'
import { NativeBaseProvider} from "native-base";
import { Camera } from 'react-native-vision-camera';
import { CodeScannerPage } from './src/components/CodeScannerPage'; 
import { CameraPage } from './src/components/CameraPage';
import TestCamera from './src/screens/import/CameraTest';
import {Routes} from './src/Routes';

const Stack = createNativeStackNavigator<Routes>();

function App(): React.JSX.Element {
  const cameraPermission = Camera.getCameraPermissionStatus()
  const showPermissionsPage = cameraPermission !== 'granted'

  
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={showPermissionsPage ? 'PermissionsPage' : 'Login'}
        >
          <Stack.Screen
            name="PermissionsPage"
            component={PermissionsPage}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{title: 'Ruito Trading'}}
          />
          <Stack.Screen name="Home"
            component={Home}
            options={{title: 'Start Scan'}}
          />
          <Stack.Screen name="ItemEditor"
            component={ItemEditor}
            options={{title: 'Add or Edit Item'}}
          />
          <Stack.Screen name="CodeScannerPage"
            component={CodeScannerPage}
            options={{title: 'Start Scan'}}
          />
          <Stack.Screen name="CameraPage" component={CameraPage} />
          {/* <Stack.Screen name="TestCameraPage" component={TestCamera} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>

  );
}

export default App;
