/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
	TextInput,
	TouchableOpacity,
	Button,
	Alert,
	ActivityIndicator,
} from 'react-native';

import { Checkbox, Tabs, Toast } from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Section from '../../components/Section';
import { commonStyles } from '../../styles/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Routes } from '../../Routes';
import { useToast } from 'native-base';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../services/auth';
import { APIURL } from '../../Constants';


type tabType = {title : string};

const tabs: tabType[] = [
	{title: 'Login'},
	{title: 'Register'},
];

type Props = NativeStackScreenProps<Routes, 'PermissionsPage'>

function Login({navigation}: any): React.JSX.Element {
	
  const isDarkMode = useColorScheme() === 'dark';
  const toast = useToast();

	const [page, setPage] = useState<string>('Login');
	const [account, setAccount] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(true);
	const [remPsw, setRemPsw] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const emailRef = useRef<TextInput>(null);
	const passwordRef = useRef<TextInput>(null);
  	const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

	const handleTabClick = (tab: any, index: Number)=>{
		setPage(tab.title);
	}

	const handleLogin = async()=>{
		if(!account){
			toast.show({description: 'Please enter email address or username.'});
			return;
		}
		if(password.length < 6){
			toast.show({description: 'Password should be at least 6 characters.'});
			return;
		}
		try{
			setIsLoading(true);
			const data = await login({
				username: account,
				password: password,
			})
			setIsLoading(false);
			navigation.navigate('Home');
			AsyncStorage.setItem('user', JSON.stringify(data))
		}catch(err){
			setIsLoading(false);
			Alert.alert('login failed', err?.message + `${APIURL}${'staff'}/login`);
		}
	}

	// const renderPage = ()=>{
	// 	switch(page){
	// 		case('Login'):{
	// 			return(

	// 			break;
	// 		}
	// 		case('Register'):{
	// 			return(<View style={{flex: 1, alignItems: 'center', margin: 40, paddingBottom: 100}}>
	// 				<Text>Please contact admin.</Text>
	// 			</View>);
	// 			break;
	// 		}
	// 	}
	// }




  return (
		<SafeAreaView>
			<StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
			<ScrollView
				contentInsetAdjustmentBehavior='automatic'
				style={[backgroundStyle, {minHeight: '100%'}]}>
				<Section title='Login' isCenter={true}></Section>
				<Section isCenter={true} narrow={true}>
					By signing in you are agreeing our <Text style={commonStyles.link}>Term and privacy policy</Text>
				</Section>
				<View style={[commonStyles.center, {marginTop: 20}]}>
						{/* <Tabs tabs={tabs} tabBarActiveTextColor='#0386D0' page={page} onChange={handleTabClick}/> */}
				</View>
				<View style={{flex: 1, alignItems: 'center'}}>
					<View style={{width: '70%'}}>
						<View style={{height: 25}}></View>
						{/* Account */}
						<View style={styles.input}>
							<Icon name='mail' size={25}/>
							<TextInput
								ref={emailRef}
								style={{paddingBottom: 0}}
								placeholder='Email Address / Username'
								onChangeText={setAccount}
								value={account}
								autoCapitalize="none"
								onSubmitEditing={()=>{passwordRef.current?.focus()}}
							/>
						</View>
						<View style={{height: 10}}></View>
						{/* Password */}
						<View style={styles.input}>
							<Icon name='lock' size={25}/>
							<TextInput
								ref={passwordRef}
								secureTextEntry={!showPassword}
								style={{paddingBottom: 0}}
								placeholder='Password'
								onChangeText={setPassword}
								value={password}
								autoCapitalize="none"
								onSubmitEditing={handleLogin}
							/>
							<TouchableOpacity onPress={()=>{setShowPassword(!showPassword)}} style={styles.inputRightIcon}>
								<Icon name={showPassword ? 'eye':'eye-invisible'}></Icon>
							</TouchableOpacity >
						</View>
						<View style={{height: 30}}></View>
						{/* Remember password */}
						<View style={styles.passwordManager}>
							<Checkbox style={{marginLeft: 0}} checked={remPsw} onChange={(e: { target: { checked: boolean } })=>setRemPsw(e.target.checked)}>Remember password</Checkbox>
							{/* <Text style={commonStyles.link}>Forget password</Text> */}
						</View>
						{/* Login */}
						<View style={{height: 40}}></View>
						<Button title='Login' onPress={handleLogin}></Button>
						<View style={[commonStyles.center, {height: 100}]}>
							<ActivityIndicator animating={isLoading} size={'large'}/>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
  );
}

const styles = StyleSheet.create({
	input: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: 'grey',
	},
	inputRightIcon:{
		position: 'absolute',
		right: 0,
	},
	passwordManager:{
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	}
});

export default Login;
