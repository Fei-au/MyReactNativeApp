import { ImagePicker, Toast } from '@ant-design/react-native';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'


import {
  Alert,
  Button,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputSubmitEditingEventData,
  ActivityIndicator,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { Select, useToast } from 'native-base';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { commonStyles } from '../../styles/styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Routes } from '../../Routes';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { get_item_info_by_code, getStatus, scrap_info_by_num_code, scrap_info_by_url } from '../../services/inventory';
import axios, { AxiosError } from 'axios';
import { NotFoundError } from '../../utils/customizeError';
import useErrorHandler  from '../../hooks/useErrorHandler';
import Clipboard from '@react-native-clipboard/clipboard';
import { getUrl } from '../../utils/regUtils';



interface CaseNumParam {
  caseNumText: string
}

interface SelectDataInterface {
  label: string,
  value: string,
}

interface IsManulInputParams {
  caseNumber?: boolean,
  itemNumber?: boolean,
  title?: boolean,
  description?: boolean,
  bCode?: boolean,
  upcCode?: boolean,
  eanCode?: boolean,
  FNSkuCode?: boolean,
  lpnCode?: boolean,
  classification?: boolean,
  size?: boolean,
  color?: boolean,
  price?: boolean,
}

type keyPressProps = {
  key: string
}

// type Props = NativeStackScreenProps<Routes, 'CodeScannerPage'>

const requestSavePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  console.log('permission', permission)
  if (permission == null) return false
  let hasPermission = await PermissionsAndroid.check(permission)
  console.log('here', hasPermission);
  if (!hasPermission) {
    const permissionRequestResult = await PermissionsAndroid.request(permission,{
      title: "External Storage Write Permission",
      message: "We needs access to your external storage to store the photo.",
      buttonNeutral: "Ask Me Later",
      buttonNegative: "Cancel",
      buttonPositive: "OK"
    })
    console.log('here2', permissionRequestResult);
    hasPermission = permissionRequestResult === 'granted'
  }
  return hasPermission
}

function Scan(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const showError = useErrorHandler();
  // Code, url used before scraping
  const navigation = useNavigation<NavigationProp<Routes>>();
  const toast = useToast();
  const [code, setCode] = useState('');
  // const [isCodeReadOnly, setIsCodeReadOnly] = useState(true); // if not capture barcode or manually go to input mode
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleScan = ()=>{
    navigation.navigate('CodeScannerPage', {getBarCode: getBarCode});
  }

  const getBarCode = (barcodes: string[])=>{
    if(barcodes.length === 0){
      toast.show({
        description: 'No code found, please enter it manully',
      })
    }else{
      setCode(barcodes[0]);
      func();
    }
    navigation.goBack()
  }

  const func = async ()=>{
    if(!code){
      return;
    }
    try{
      setIsLoading(true);
      const item = await scrap_info_by_num_code(code);
      setIsLoading(false);
      console.log('item', item)
      navigation.navigate('ItemEditor', {itemInfo: item});
    }catch(err : any){
      setIsLoading(false);
      if(err instanceof NotFoundError){
        toast.show({
          description: 'No item info found in database, please input B0 code or Amz website link',
        })
      }else{
        showError(err);
      }
    }
  }

  const handleCodeOnBlur = ()=>{
    func();
  }

  const onPressStartScraping = async()=>{
    try{
      setIsLoading(true)
      const item = await scrap_info_by_url(url);
      setIsLoading(false)
      navigation.navigate('ItemEditor', {itemInfo: item});
    }catch(err){
      toast.show({
        description: 'Nothing scraped, please input item information manully',
      })
    }
  }

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>)=>{
    if(e.nativeEvent.key === 'Backspace'){
      setIsClearing(true)
    }
  }

  const handleChangeUrl = (str: string)=>{
    if(isClearing){
      setUrl('')
      setIsClearing(false)
    }else{
      setUrl(str)
    }
  }

  const handleSubmitUrl = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>)=>{
    onPressStartScraping();
  }

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    const u = getUrl(text);
    if(u){
      setUrl(u);
    }else{
      setUrl(text)
    }
  };

  return (
    <ScrollView style={[{backgroundColor: backgroundStyle.backgroundColor}, styles.scrollViewStyle]}>
      {/* Scan button container */}
      <TouchableOpacity style={commonStyles.center} onPress={!isLoading ? handleScan : ()=>{}} disabled={isLoading}>
        <MaterialIcon name='barcode-scan' size={50}/>
        <Text>Scan Code</Text>
      </TouchableOpacity>
      <View style={{height: 20}}/>
      <>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Code <Text style={{color: 'red'}}>*</Text></Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setCode}
            value={code}
            onBlur={handleCodeOnBlur}
            readOnly={isLoading}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Website Link</Text>
          <View style={commonStyles.row}>
            <TextInput
              style={[styles.inputStyle, commonStyles.inputWithIcon]}
              onChangeText={handleChangeUrl}
              value={url}
              onKeyPress={handleKeyPress}
              onSubmitEditing={handleSubmitUrl}
              readOnly={isLoading}
            />
            <TouchableOpacity onPress={fetchCopiedText} style={[commonStyles.inputButtonStyle, commonStyles.center]}>
              <FontAwesomeIcon name='paste' size={25}/>
            </TouchableOpacity>
          </View>
        </View>
        <Button
          onPress={onPressStartScraping}
          title="Start Scraping"
          disabled={!url || isLoading}
        />
        <View style={{height: 100, flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
          <ActivityIndicator animating={isLoading} size={'large'}/>
        </View>
      </>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewStyle: {
    paddingHorizontal: 15,
    paddingTop: 15
  },
  labelStyle: {
    color: '#002F48',
    fontWeight: '600',
    marginBottom: 5,
  },
  inputStyle: {
    borderColor: '#E4E3E3',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10
  },
  inputContainerStyle:{
    marginBottom: 10
  }
});

export default Scan;
