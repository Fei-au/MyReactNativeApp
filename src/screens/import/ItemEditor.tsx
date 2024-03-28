import { ActivityIndicator, ImagePicker, Toast } from '@ant-design/react-native';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormData from 'form-data';

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
import { Flex, Modal, Select, useToast } from 'native-base';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { add_new_item, get_item_info_by_code, getCategory, getStatus, image_upload } from '../../services/inventory';
import axios, { AxiosError } from 'axios';
import { getBidStartPrice } from '../../utils/inventoryUtils';
import Scanner from '../../components/Scanner';
import { PhotoFile, VideoFile } from 'react-native-vision-camera';
import { commonStyles } from '../../styles/styles';
import { CameraOptions, ImagePickerResponse, launchCamera, OptionsCommon } from 'react-native-image-picker';
import { errorHandler } from '../../utils/errorHandler';
import { imageType, userType } from '../../utils/types';
import { get_next_item_number } from '../../services/auth';


interface CaseNumParam {
  caseNumText: string
}

interface SelectDataInterface {
  label: string,
  value: string,
}

type statusDataType = {
  id: string
  status: string
}

type categoryDataType = {
  id: string,
  name: string,
}
interface IsManulInputParams {
  caseNumber?: boolean,
  itemNumber?: boolean,
  title?: boolean,
  description?: boolean,
  bCode?: boolean,
  upcEanCode?: boolean,
  // upcCode?: boolean,
  // eanCode?: boolean,
  // FNSkuCode?: boolean,
  // lpnCode?: boolean,
  category?: boolean,
  size?: boolean,
  color?: boolean,
  price?: boolean,
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

function ItemEditor({route, navigation}: any): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  // Code, url used before scraping
  // const {itemInfo} = route.params;
  const [itemInfo, setItemInfo] = useState(route.params.itemInfo);
  const isNew = route.params.isNew;
  const toast = useToast();

  const [modalVisible, setModalVisible] = useState(false);
  // If no url to scrap, use manul input mode
  const [isManulInput, setIsManulInput] = useState<IsManulInputParams>({});

  // Following params used for after scraping
  const [caseNumber, setCaseNumber] = useState(itemInfo.case_number || '');
  const [itemNumber, setItemNumber] = useState(isNew ? '' : (itemInfo.item_number || ''));
  const [title, setTitle] = useState(itemInfo.title || '');
  const [description, setDescription] = useState(itemInfo.description || '');

  const [bCode, setBCode] = useState(itemInfo.b_code || '');
  const [upcEanCode, setUpcEanCode] = useState(itemInfo.upc_ean_code || '');
  // const [upcCode, setUpcCode] = useState(itemInfo.upc_code || '');
  // const [eanCode, setEanCode] = useState(itemInfo.ean_code || '');
  // const [FNSkuCode, setFNSkuCode] = useState(itemInfo.fnsku_code || '');
  const [lpnCode, setLpnCode] = useState(itemInfo.lpn_code || '');
  const [pics, setPics] = useState<{}[]>(itemInfo.images ? itemInfo.images.map((ele:imageType)=>{return {id: Math.random(), img_id: ele.id, url: ele.full_image_url}}): []); // Item pictures, get from 1. database 2. scraped 3. photos taken
  
  const [status, setStatus] = useState<string>(isNew ? '' : (itemInfo.status ? itemInfo.status.toString() : ''));
  const [statusData, setStatusData] = useState<SelectDataInterface[]>([]); // Status enum data, get from database
  const [statusNote, setStatusNote] = useState(isNew ? '' : (itemInfo.status_note || ''));
  
  const [category, setCategory] = useState(itemInfo.category ? itemInfo.category.toString() : '');
  const [classificationData, setClassificationData] = useState<SelectDataInterface[]>([]);

  const [size, setSize] = useState(isNew ? '' : (itemInfo.customize_size || ''));
  const [color, setColor] = useState(isNew ? '' : (itemInfo.customize_color || ''));
  const [price, setPrice] = useState(itemInfo.msrp_price ? '$' + itemInfo.msrp_price : undefined);
  const [location, setLocation] = useState(isNew ? '' : (itemInfo.location || ''));
  const urlRef = useRef('');
  // const [shelf, setSelf] = useState('');
  // const [layer, setLayer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bidStartPriceRef = useRef((itemInfo.bid_start_price + '') || null);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const userRef = useRef<userType>();

  useEffect(()=>{
    const func = async ()=>{
      try{
        const ur = await AsyncStorage.getItem('user')
        userRef.current = JSON.parse(ur as string);
        const pmList = [
          getStatus(),
          getCategory(),
          get_next_item_number(userRef.current?.staff_id || 0),
          AsyncStorage.getItem('case_number'),
          AsyncStorage.getItem('location'),
        ];
        const [statuslist, categlist, nextItemNumber, storedValue, storedLocation] = await Promise.all(pmList);

        if(isNew){
          setItemNumber(nextItemNumber)
        }
        setCaseNumber(storedValue || '');
        setLocation(storedLocation || '');
        setStatusData(statuslist.map((ele: statusDataType)=> {return {label: ele.status, value: ele.id.toString() }}))
        setClassificationData(categlist.map((ele: categoryDataType)=> {return {label: ele.name, value: ele.id.toString() }}))
    }catch(err){
      errorHandler(err);
      }
    }
    func();
  }, [])

  // useEffect(()=>{
  //   setBCode(route.params?.b_code)
  // }, [route.params?.b_code])

  // useEffect(()=>{
  //   setUpcEanCode(route.params?.upc_ean_code)
  // }, [route.params?.upc_ean_code])

  // useEffect(()=>{
  //   setLocation(route.params?.location)
  // }, [route.params?.location])



  const handleCaseNumberChange=(text : string)=>{
    const numericText = text.replace(/[^0-9]/g, '');
    setCaseNumber(numericText);
  }
  const handleItemNumberChange=(text : string)=>{
    const numericText = text.replace(/[^0-9]/g, '');
    setItemNumber(numericText);
  }

  const handlePriceChange = (text: string)=>{
    if(!text){
      return;
    }
    const cleanedText = text.replace(/[^0-9.]/g, '');
    const formattedText = `$${cleanedText}`;
    setPrice(formattedText);
    bidStartPriceRef.current = getBidStartPrice(parseFloat(cleanedText)) + ''
  }

  const handlePriceBlur = ()=>{
    if(!price){
      return;
    }
    bidStartPriceRef.current = getBidStartPrice(parseFloat(price.substring(1,))) + ''
  }
  

  const onAddImageClick = ()=>{
    if(pics.length >= 10){
      toast.show({description: 'Reach maximum photo limit 10, please remove other photos first!'});
      return;
    }
    // react-native-image-picker
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.3
    };
    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        if(response.assets){
          const newPath = response.assets[0].uri;
          setPics([...pics, {
            url: newPath,
            id: Math.random(),
          }])
        }else{
          Alert.alert('Failed to take photo!', `An unexpected error occured while trying to taken photo.`)
        }
      }
    });
    // navigation.navigate('CameraPage', {afterTakenPhoto: afterTakenPhoto});
  }

  const afterTakenPhoto = async(photo: PhotoFile | VideoFile)=>{
    const {path} = photo;
    const type = 'photo';
    console.log('photo', photo)
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
  const requiredCheck = (i : string | Array<any>, name: string)=>{
    if(typeof i === 'string'){
        if(!i){
            toast.show({description: `${name} is required.`});
            return false;
        }
    }else{
        if(i.length === 0){
            toast.show({description: `${name} is required.`});
            return false;
        }
    }
    return true;
  }
  const handleSubmit = async ()=>{
    try{
      if(!requiredCheck(caseNumber, 'Case number')) return false;
      if(!requiredCheck(title, 'Title')) return false;
      if(!requiredCheck(description, 'Description')) return false;
    //   if(!requiredCheck(pics, 'Picture')) return false;
      if(!requiredCheck(status, 'Status')) return false;
      if(status !== '1' && status !== '2' && !requiredCheck(statusNote, 'Status note')) return false;
      if(!requiredCheck(category, 'category')) return false;
      if(!requiredCheck(price || '', 'Price')) return false;
      if(!requiredCheck(location, 'Location')) return false;
      // if(!requiredCheck(shelf, 'Shelf')) return false;
      // if(!requiredCheck(layer, 'Layer')) return false;
      // fd.append('case_number', caseNumber);
      // fd.append('item_number', itemNumber);
      // fd.append('title', title);
      // fd.append('description', description);
      // fd.append('b_code', bCode);
      // fd.append('upc_code', upcCode);
      // fd.append('ean_code', eanCode);
      // fd.append('fnsku_code', FNSkuCode);
      // fd.append('lpn_code', lpnCode);
      // fd.append('msrp_price', Number(price.substring(1,)));
      // fd.append('bid_start_price', bidStartPriceRef.current);
      // fd.append('status_id', status);
      // fd.append('status_note', statusNote);
      // fd.append('category_id', category);
      // fd.append('shelf', shelf);
      // fd.append('layer', layer);
      // fd.append('customize_sie', size);
      // fd.append('customize_color', color);

      // fd.append('pics', pics.map(ele=>))
      const fd = new FormData();
      const item = {
        case_number: caseNumber,
        item_number: itemNumber,
        title: title,
        description: description,
        b_code: bCode,
        upc_ean_code: upcEanCode,
        // upc_code: upcCode,
        // ean_code: eanCode,
        // fnsku_code: FNSkuCode,
        lpn_code: lpnCode,
        msrp_price: Number(price?.substring(1,)),
        bid_start_price: bidStartPriceRef.current,
        status: parseInt(status),
        status_note: statusNote,
        category: parseInt(category),
        location: location,
        // shelf: shelf,
        // layer: layer,
        customize_size: size + '',
        customize_color: color,
        add_staff: userRef.current?.staff_id || 0,
        add_user: userRef.current?.user_id || 0,
        id: itemInfo.id,
      }
      console.log('item', item)
      fd.append('item', JSON.stringify(item))
      fd.append('is_new', !!isNew)
      // fd.append('pics', pics.map((ele, index)=>{return {...ele, name: `${index}image`}}))
      // fd.append('images', pics.map((ele, index)=>{return {uri: ele.url, name: `${index}image`, type: 'image/jpg'}})
      pics.forEach((ele: any, index)=>{
        if(ele.img_id){
          console.log('img_id', ele.img_id)
          fd.append('img_id', ele.img_id)
        }else{
          fd.append('image', {uri: ele.url, name: `${index+1}img.jpg`, type: 'image/jpg'})
        }
      })
      console.log('submit')
      setIsLoading(true);
      const res = await add_new_item(fd);
      await AsyncStorage.setItem('case_number', caseNumber);
      await AsyncStorage.setItem('location', location);
      setIsLoading(false);
      // const res = await image_upload(fd);
      console.log('**********res', res);
      Alert.alert(
        'Item Detail',
        `new item ${res.item_number} at location ${location}`, 
        [
          {
            text: 'OK',
            onPress: ()=> navigation.navigate('Home'),
          }
        ]
      )
    }catch(err){
      errorHandler(err);
      console.log(err)
      setIsLoading(false);
    }
  }


  return (
    <ScrollView style={[{backgroundColor: backgroundStyle.backgroundColor}, styles.scrollViewStyle]}>
      <>
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Add Item Success</Modal.Header>
        <Modal.Body>
            <Text style={{fontSize: 30}}>{itemNumber}</Text>
        </Modal.Body>
        </Modal.Content>
      </Modal>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Case Number<Text style={{color: 'red'}}>*</Text></Text>
          <TextInput
            style={styles.inputStyle}
            keyboardType='numeric'
            onChangeText={handleCaseNumberChange}
            value={caseNumber + ''}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Title<Text style={{color: 'red'}}>*</Text></Text>
          <TextInput
            multiline={true}
            numberOfLines={10}
            style={[styles.inputStyle, { height:60, textAlignVertical: 'top'}]}
            onChangeText={setTitle}
            value={title}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Description</Text>
          <TextInput
            multiline={true}
            numberOfLines={10}
            style={[styles.inputStyle, { height:100, textAlignVertical: 'top'}]}
            onChangeText={setDescription}
            value={description}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>B0 Code</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.inputStyle, styles.inputWithIcon]}
              onChangeText={setBCode}
              value={bCode}
            />
            <Scanner scannerStyle={styles.scannerStyle} setCode={setBCode}/>
          </View>
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Number Code</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.inputStyle, styles.inputWithIcon]}
              onChangeText={setUpcEanCode}
              value={upcEanCode}
            />
            <Scanner scannerStyle={styles.scannerStyle} setCode={setUpcEanCode}/>
          </View>
        </View>
        {/* <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>UPC Code</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setUpcCode}
            value={upcCode}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>EAN Code</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setEanCode}
            value={eanCode}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>FNSku Code</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setFNSkuCode}
            value={FNSkuCode}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>LPN Code</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setLpnCode}
            value={lpnCode}
          />
        </View> */}
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Pictures<Text style={{color: 'red'}}>*</Text></Text>
          <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
            <ImagePicker
              onChange={setPics}
              files={pics.map(ele=>{return {...ele, id: Math.random()}})}
              selectable={true}
              onAddImageClick={onAddImageClick}
            />
          </View>
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Status<Text style={{color: 'red'}}>*</Text></Text>
          <Select selectedValue={status} minWidth="200" accessibilityLabel="Choose Status" placeholder="Choose Status" _selectedItem={{bg: "teal.600", endIcon: <AntIcon name='check' size={5} />}} mt={1} onValueChange={setStatus}>
            {statusData.map((item)=><Select.Item label={item.label} value={item.value} />)}
          </Select>
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>
            Status Note
            {(status !== '1' && status !== '2') ? <Text style={{color: 'red'}}>*</Text> : null}
          </Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setStatusNote}
            value={statusNote}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Category<Text style={{color: 'red'}}>*</Text></Text>
          <Select selectedValue={category} minWidth="200" accessibilityLabel="Choose Class" placeholder="Choose Class" _selectedItem={{bg: "teal.600", endIcon: <AntIcon name='check' size={5} />}} mt={1} onValueChange={setCategory}>
            {classificationData.map((item)=><Select.Item label={item.label} value={item.value} />)}
          </Select>
          {/* {category === 'Add New' && <TextInput
            style={[styles.inputStyle, {marginTop: 10}]}
            onChangeText={setNewClass}
            value={newClass}
          />} */}
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Size</Text>
          {/* <Select isDisabled={!isManulInput.size} selectedValue={size} minWidth="200" accessibilityLabel="Choose Size" placeholder="Choose Size" _selectedItem={{bg: "teal.600", endIcon: <AntIcon name='check' size={5} />}} mt={1} onValueChange={setSize}>
            {sizeData.map((item)=><Select.Item label={item.label} value={item.value} />)}
          </Select>
          {size === 'Add New' && <TextInput
            style={[styles.inputStyle, {marginTop: 10}]}
            onChangeText={setNewSize}
            value={newSize}
          />} */}
          <TextInput
            style={styles.inputStyle}
            onChangeText={setSize}
            value={size}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Color</Text>
          {/* <Select isDisabled={!isManulInput.color} selectedValue={color} minWidth="200" accessibilityLabel="Choose Size" placeholder="Choose Color" _selectedItem={{bg: "teal.600", endIcon: <AntIcon name='check' size={5} />}} mt={1} onValueChange={setColor}>
            {colorData.map((item)=><Select.Item label={item.label} value={item.value} />)}
          </Select>
          {color === 'Add New' && <TextInput
            style={[styles.inputStyle, {marginTop: 10}]}
            onChangeText={setNewColor}
            value={newColor}
          />} */}
          <TextInput
            style={styles.inputStyle}
            onChangeText={setColor}
            value={color}
          />
        </View>
        <View style={[styles.inputContainerStyle]}>
          <Text style={styles.labelStyle}>Price<Text style={{color: 'red'}}>*</Text></Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={handlePriceChange}
            value={price}
            keyboardType='numeric'
            onBlur={handlePriceBlur}
            // readOnly={!isManulInput.price}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Item Number</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.inputStyle, styles.inputWithIcon]}
              keyboardType='numeric'
              onChangeText={handleItemNumberChange}
              value={itemNumber + ''}
            />
            <Scanner scannerStyle={styles.scannerStyle} setCode={setItemNumber}/>
          </View>
        </View>
        <View style={[styles.inputContainerStyle]}>
          <Text style={styles.labelStyle}>Location<Text style={{color: 'red'}}>*</Text></Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.inputStyle, styles.inputWithIcon]}
              onChangeText={setLocation}
              value={location}
            />
            <Scanner scannerStyle={styles.scannerStyle} setCode={setLocation}/>
          </View>
        </View>
        {/* <View style={[styles.inputContainerStyle]}>
          <Text style={styles.labelStyle}>Shelf<Text style={{color: 'red'}}>*</Text></Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setSelf}
            value={shelf}
            keyboardType='numeric'
          />
        </View>
        <View style={[styles.inputContainerStyle]}>
          <Text style={styles.labelStyle}>Layer<Text style={{color: 'red'}}>*</Text></Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setLayer}
            value={layer}
          />
        </View> */}
        <View style={[styles.inputContainerStyle, {paddingBottom: 30}]}>
          <Button title='Submit' onPress={handleSubmit} disabled={isLoading}/>
        </View>
        {isLoading && <View style={[{height: 60}, commonStyles.center]}>
          <ActivityIndicator animating={true} size={'large'}/>
        </View>}
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
  },
  row: {
    flexDirection: 'row',
  },
  inputWithIcon:{
    flex: 6
  },
  scannerStyle:{
    flex: 1,
  }
});

export default ItemEditor;
