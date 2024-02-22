import React from "react";
import { Select, View, useToast } from 'native-base';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from "react-native-svg";
import { commonStyles } from "../styles/styles";
import { Routes } from "../Routes";


type ScannerProps = {
    scannerStyle: object,
    codeName?: string,
    setCode: (value: string) => void,
}


function Scanner({scannerStyle, codeName, setCode}: ScannerProps){
    const toast = useToast();
    const navigation = useNavigation<NavigationProp<Routes>>();

    const handleScan = ()=>{
        navigation.navigate('CodeScannerPage', {getBarCode: getBarCode});
      }
    
    const getBarCode = (barcodes: string[])=>{
        if(barcodes.length === 0){
            toast.show({
                description: 'No code found, please enter it manully',
            })
        }else{
            setCode(barcodes[0])
            navigation.goBack()
            // navigation.navigate('ItemEditor', {[codeName]: barcodes[0]});
            // setCode(barcodes[0]);
        }
    }

    return (
        <GestureHandlerRootView style={[scannerStyle, commonStyles.center]}>
            <TouchableOpacity onPress={handleScan}>
                <MaterialIcon name='barcode-scan' size={30}/>
            </TouchableOpacity>
        </GestureHandlerRootView >
    );
}

export default Scanner;