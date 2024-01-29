import { Icon, Toast } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Scanner from '../../components/Scanner';

function Scan(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  // Code, url used before scraping
  const [code, setCode] = useState('');
  const [isCodeReadOnly, setIsCodeReadOnly] = useState(true); // if not capture barcode or manually go to input mode
  const [url, setUrl] = useState('');
  const [isUrlReadOnly, setIsUrlReadOnly] = useState(true);
  const [hasScraped, setHasScraped] = useState(false);

  // If no url to scrap, use manul input mode
  const [isManulInput, setIsManulInput] = useState(false);

  // Following params used for after scraping
  const [caseNumber, setCaseNumber] = useState(0);
  const [title, setTitle] = useState('');
  const [numCode, setNumCode] = useState('');
  const [boCode, setBOCode] = useState('');
  const [xCode, setXCode] = useState('');
  const [description, setDescription] = useState('');
  const [pics, setPics] = useState([]);
  const [status, setStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [classification, setClassification] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState(999.00);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(()=>{
    setIsCodeReadOnly(false);
    setHasScraped(false);
    setIsManulInput(false);
  }, [])

  const getBarcode = ({ barcodes })=>{
    if(!barcodes){
      setIsCodeReadOnly(false);

    }
    console.log('barcodes', barcodes);
  }

  const handleCodeOnBlur = async()=>{
    // valid the code's url
    // 
    let valid = false;
    if(valid){
      setUrl('value');
    }else{
      Toast.info({
        content: 'No relative website found, please input item information manully',
        duration: 3,
        stackable: true,
      })
      setTimeout(() => {
        setHasScraped(true);
        setIsManulInput(true);
      }, 3000);
    }
  }

  const handleCaseNumberChange=(text)=>{
    const numericText = text.replace(/[^0-9]/g, '');
    setCaseNumber(numericText);
  }

  const onPressStartScraping = async()=>{
    // Get item information
    let info;
    // Set information
    if(!info){
      Toast.info({
        content: 'Nothing scraped, please input item information manully',
        duration: 3,
        stackable: true,
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


  return (
    <ScrollView style={[{backgroundColor: backgroundStyle.backgroundColor}, styles.scrollViewStyle]}>
      {/* Scan button container */}
      
      <Scanner />
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
          <Text style={styles.labelStyle}>Title</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setTitle}
            value={caseNumber + ''}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Title</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={handleCaseNumberChange}
            value={caseNumber + ''}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Title</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={handleCaseNumberChange}
            value={caseNumber + ''}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Title</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={handleCaseNumberChange}
            value={caseNumber + ''}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Title</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={handleCaseNumberChange}
            value={caseNumber + ''}
          />
        </View>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.labelStyle}>Title</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={handleCaseNumberChange}
            value={caseNumber + ''}
          />
        </View>
        <View style={[styles.inputContainerStyle, {paddingBottom: 30}]}>
          <Text style={styles.labelStyle}>Title</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={handleCaseNumberChange}
            value={caseNumber + ''}
          />
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
