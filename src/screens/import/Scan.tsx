import { ImagePicker, Toast } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
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
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { Select, useToast } from 'native-base';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { commonStyles } from '../../styles/styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Routes } from '../../Routes';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';


interface CaseNumParam {
  caseNumText: string
}

interface SelectDataInterface {
  label: string,
  value: string,
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
  // Code, url used before scraping
  const navigation = useNavigation();
  const toast = useToast();

  const [code, setCode] = useState('');
  const [isCodeReadOnly, setIsCodeReadOnly] = useState(true); // if not capture barcode or manually go to input mode
  const [url, setUrl] = useState('');
  const [isUrlReadOnly, setIsUrlReadOnly] = useState(true);
  const [hasScraped, setHasScraped] = useState(false);

  // If no url to scrap, use manul input mode
  const [isManulInput, setIsManulInput] = useState(false);

  // Following params used for after scraping
  const [caseNumber, setCaseNumber] = useState('');
  const [itemNumber, setItemNumber] = useState('');
  const [title, setTitle] = useState('');
  const [numCode, setNumCode] = useState('');
  const [boCode, setBOCode] = useState('');
  const [xCode, setXCode] = useState('');
  const [lpnCode, setLpnCode] = useState('');
  const [description, setDescription] = useState('');
  const [pics, setPics] = useState<{}[]>([]); // Item pictures, get from 1. database 2. scraped 3. photos as ordered
  
  const [status, setStatus] = useState('');
  const [statusData, setStatusData] = useState<SelectDataInterface[]>([]); // Status enum data, get from database
  const [statusNote, setStatusNote] = useState('');
  
  const [classification, setClassification] = useState('');
  const [classificationData, setClassificationData] = useState<SelectDataInterface[]>([{label: 'Add New', value: 'Add New'}]);
  const [isClassDisable, setIsClassDisable] = useState(true); // Classfication disabled as default, set false when no classification scraped.
  const [newClass, setNewClass] = useState('');

  const [size, setSize] = useState('');
  const [sizeData, setSizeData] = useState<SelectDataInterface[]>([{label: 'Add New', value: 'Add New'}]);
  const [isSizeDisable, setisSizeDisable] = useState(true);
  const [newSize, setNewSize] = useState('');

  const [color, setColor] = useState('');
  const [colorData, setColorData] = useState<SelectDataInterface[]>([{label: 'Add New', value: 'Add New'}]);
  const [isColorDisable, setIsColorDisable] = useState(true);
  const [newColor, setNewColor] = useState('');
  const [price, setPrice] = useState('999.00');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(()=>{
    setHasScraped(true);
    setIsManulInput(false);
  }, [])

  const handleScan = ()=>{
    navigation.navigate('CodeScannerPage', {getBarCode: getBarCode});
  }

  const getBarCode = (barcodes: string[])=>{
    if(barcodes.length === 0){
      setIsCodeReadOnly(false);
    }else{
      setCode(barcodes[0]);

    }
  }

  const handleCodeOnBlur = async()=>{
    // valid the code's url
    // 

    let valid = false;
    if(valid){
      setUrl('value');
    }else{
      toast.show({
        description: 'No relative website found, please input item information manully',
      })
      setTimeout(() => {
        setHasScraped(true);
        setIsManulInput(true);
      }, 5000);
    }
  }

  const handleCaseNumberChange=(text : string)=>{
    const numericText = text.replace(/[^0-9]/g, '');
    setCaseNumber(numericText);
  }
  const handleItemNumberChange=(text : string)=>{
    const numericText = text.replace(/[^0-9]/g, '');
    setItemNumber(numericText);
  }

  const handlePriceChange = (text: string)=>{
    const cleanedText = text.replace(/[^0-9.]/g, '');
    const formattedText = `$${cleanedText}`;
    setPrice(formattedText);
  }

  const onPressStartScraping = async()=>{
    // Get item information
    let info;
    // Set information
    if(!info){
      toast.show({
        description: 'Nothing scraped, please input item information manully',
      })
      setTimeout(() => {
        setIsManulInput(true);
        setHasScraped(true);
      }, 3000);
    }else{
      // Set info

      setHasScraped(true);
    }
  }

  const onAddImageClick = ()=>{
    if(pics.length >= 10){
      toast.show({description: 'Reach maximum photo limit 10, please remove other photos first!'});
      return;
    }
    navigation.navigate('CameraPage', {afterTakenPhoto: afterTakenPhoto});
  }

  const afterTakenPhoto = async(photo)=>{
    const {path} = photo;
    const type = 'photo';
    try {
      const hasPermission = await requestSavePermission()
      if (!hasPermission) {
        Alert.alert('Permission denied!', 'Vision Camera does not have permission to save the media to your camera roll.')
        return
      }
      const newPath = await CameraRoll.save(`file://${path}`, {
        type: type,
      })
      setPics([...pics, {
        url: newPath,
        id: Math.random(),
      }])
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e)
      Alert.alert('Failed to save!', `An unexpected error occured while trying to save your photo. ${message}`)
    }

  }
  const handleSubmit = ()=>{
    console.log('submit')
  }


  return (
    <ScrollView style={[{backgroundColor: backgroundStyle.backgroundColor}, styles.scrollViewStyle]}>
      {/* Scan button container */}
      <TouchableOpacity style={commonStyles.center} onPress={handleScan}>
        <MaterialIcon name='barcode-scan' size={50}/>
        <Text>Scan</Text>
      </TouchableOpacity>
      <View style={{height: 20}}/>
      {!hasScraped ? 
      <>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Code</Text>
          <TextInput
            style={styles.inputStyle}
            readOnly={isCodeReadOnly}
            onChangeText={setCode}
            value={code}
            onBlur={handleCodeOnBlur}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Website Link</Text>
          <TextInput
            style={styles.inputStyle}
            readOnly={isUrlReadOnly}
            onChangeText={setUrl}
            value={url}
          />
        </View>
        <Button
          onPress={onPressStartScraping}
          title="Start Scraping"
          disabled={!url}
        />
      </>
      :
      <>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Case Number</Text>
          <TextInput
            style={styles.inputStyle}
            keyboardType='numeric'
            onChangeText={handleCaseNumberChange}
            value={caseNumber + ''}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Item Number</Text>
          <TextInput
            style={styles.inputStyle}
            keyboardType='numeric'
            onChangeText={handleItemNumberChange}
            value={itemNumber + ''}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Title</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setTitle}
            value={title}
            readOnly={!isManulInput}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Number Code</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setNumCode}
            value={numCode}
            readOnly={!isManulInput}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>BO Code</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setBOCode}
            value={boCode}
            readOnly={!isManulInput}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>X Code</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setXCode}
            value={xCode}
            readOnly={!isManulInput}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>LPN Code</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setLpnCode}
            value={lpnCode}
            readOnly={!isManulInput}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Description</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setDescription}
            value={description}
            readOnly={!isManulInput}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Pictures</Text>
          <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
            <ImagePicker
              onChange={setPics}
              files={pics}
              selectable={true}
              onAddImageClick={onAddImageClick}
            />
          </View>
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Status</Text>
          <Select selectedValue={status} minWidth="200" accessibilityLabel="Choose Status" placeholder="Choose Status" _selectedItem={{bg: "teal.600", endIcon: <AntIcon name='check' size={5} />}} mt={1} onValueChange={setStatus}>
            {statusData.map((item)=><Select.Item label={item.label} value={item.value} />)}
          </Select>
        </View>
        {(status !== '' && status !== 'new') ? <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Status Note</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setStatusNote}
            value={statusNote}
          />
        </View> : null}
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Classification</Text>
          <Select isDisabled={isClassDisable} selectedValue={classification} minWidth="200" accessibilityLabel="Choose Class" placeholder="Choose Class" _selectedItem={{bg: "teal.600", endIcon: <AntIcon name='check' size={5} />}} mt={1} onValueChange={setClassification}>
            {classificationData.map((item)=><Select.Item label={item.label} value={item.value} />)}
          </Select>
          {classification === 'Add New' && <TextInput
            style={[styles.inputStyle, {marginTop: 10}]}
            onChangeText={setNewClass}
            value={newClass}
          />}
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Size</Text>
          <Select isDisabled={isSizeDisable} selectedValue={size} minWidth="200" accessibilityLabel="Choose Size" placeholder="Choose Size" _selectedItem={{bg: "teal.600", endIcon: <AntIcon name='check' size={5} />}} mt={1} onValueChange={setSize}>
            {sizeData.map((item)=><Select.Item label={item.label} value={item.value} />)}
          </Select>
          {size === 'Add New' && <TextInput
            style={[styles.inputStyle, {marginTop: 10}]}
            onChangeText={setNewSize}
            value={newSize}
          />}
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Color</Text>
          <Select isDisabled={isColorDisable} selectedValue={color} minWidth="200" accessibilityLabel="Choose Size" placeholder="Choose Color" _selectedItem={{bg: "teal.600", endIcon: <AntIcon name='check' size={5} />}} mt={1} onValueChange={setColor}>
            {colorData.map((item)=><Select.Item label={item.label} value={item.value} />)}
          </Select>
          {color === 'Add New' && <TextInput
            style={[styles.inputStyle, {marginTop: 10}]}
            onChangeText={setNewColor}
            value={newColor}
          />}
        </View>
        <View style={[styles.inputContainerStyle]}>
          <Text style={styles.labelStyle}>Price</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={handlePriceChange}
            value={price}
            keyboardType='numeric'
          />
        </View>
        <View style={[styles.inputContainerStyle, {paddingBottom: 30}]}>
          <Button title='Submit' onPress={handleSubmit}/>
        </View>
      </>}
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
