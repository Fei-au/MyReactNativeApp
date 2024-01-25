/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
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
} from 'react-native';

import { Tabs } from '@ant-design/react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Section from '../../components/Section';
import { commonStyles } from '../../styles/styles';




const tabs = [
	{title: 'Login'},
	{title: 'Register'},
];

function Login(): React.JSX.Element {
	
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

	const handleTabClick = (tab: any)=>{
		// switch(tab){
		// 	case('Login'):{


		// 	}
		// }
	}

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
				<View style={[commonStyles.center, ]}>
					<View style={{width: '50%'}}>
						<Tabs tabs={tabs} tabBarBackgroundColor={backgroundStyle.backgroundColor} onTabClick={handleTabClick}/>
					</View>

				</View>

			</ScrollView>
		</SafeAreaView>
  );
}

const styles = StyleSheet.create({

});

export default Login;
