/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
	Dimensions,
	TextInput,
	TouchableOpacity,
	Button,
	Alert,
} from 'react-native';

import { Checkbox, Tabs, Toast } from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Section from '../../components/Section';
import { commonStyles } from '../../styles/styles';


type tabType = {title : string};

const tabs: tabType[] = [
	{title: 'Login'},
	{title: 'Register'},
];

function Login({navigation}): React.JSX.Element {
	
  const isDarkMode = useColorScheme() === 'dark';
	const [page, setPage] = useState<string>('Login');
	const [account, setAccount] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(true);
	const [remPsw, setRemPsw] = useState(true);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

	const handleTabClick = (tab: any, index: Number)=>{
		setPage(tab.title);
	}

	const handleLogin = ()=>{
		if(!account){
			Toast.fail({content: 'Please enter email address or username.'});
		}
		if(password.length < 6){
			Toast.fail({content: 'Password should be at least 6 characters.'});
		}
		navigation.navigate('Home');
	}

	const renderPage = ()=>{
		switch(page){
			case('Login'):{
				return(
					<View style={{flex: 1, alignItems: 'center'}}>
						<View style={{width: '70%'}}>
							<View style={{height: 25}}></View>
							{/* Account */}
							<View style={styles.input}>
								<Icon name='mail' size={25}/>
								<TextInput
									style={{paddingBottom: 0}}
									placeholder='Email Address / Username'
									onChangeText={setAccount}
									value={account}
									autoCapitalize="none"
								/>
							</View>
							<View style={{height: 10}}></View>
							{/* Password */}
							<View style={styles.input}>
								<Icon name='lock' size={25}/>
								<TextInput
									secureTextEntry={!showPassword}
									style={{paddingBottom: 0}}
									placeholder='Password'
									onChangeText={setPassword}
									value={password}
									autoCapitalize="none"
								/>
								<TouchableOpacity onPress={()=>{setShowPassword(!showPassword)}} style={styles.inputRightIcon}>
									<Icon name={showPassword ? 'eye':'eye-invisible'}></Icon>
								</TouchableOpacity >
							</View>
							<View style={{height: 30}}></View>
							{/* Remember password */}
							<View style={styles.passwordManager}>
								<Checkbox style={{marginLeft: 0}} checked={remPsw} onChange={(e: { target: { checked: boolean } })=>setRemPsw(e.target.checked)}>Remember password</Checkbox>
								<Text style={commonStyles.link}>Forget password</Text>
							</View>
							{/* Login */}
							<View style={{height: 40}}></View>
							<Button title='Login' onPress={handleLogin}></Button>
						</View>
					</View>);
				break;
			}
			case('Register'):{
				return(<View style={{flex: 1, alignItems: 'center', margin: 40, paddingBottom: 100}}>
					<Text>Please contact admin.</Text>
				</View>);
				break;
			}
		}
	}

	// const tabStyle = (title: any)=>{
	// 	if(title === page){
	// 		return {color: 'lightblue'};
	// 	}else{
	// 		return {};
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
					<View style={{width: '50%'}}>
						<Tabs tabs={tabs} tabBarActiveTextColor='#0386D0' page={page} onTabClick={handleTabClick}/>
					</View>
				</View>
				{renderPage()}
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
