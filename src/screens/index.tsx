import React, { ReactPropTypes, useState } from 'react';
import {
  StyleSheet,
  useColorScheme,
} from 'react-native';

import { Icon, TabBar } from '@ant-design/react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Scan from './import/Scan';
import Dashboard from './dashboard/dashboard';
import Profile from './profile/profile';


const tabs = {
    scan: 'Start Scan',
    dashboard: 'Dashboard',
    profile: 'Profile',
};


function BottomMenu(props: homeProps): React.JSX.Element {
    const {navigation} = props;
    const isDarkMode = useColorScheme() === 'dark';
    const [selectedTab, setSelectedTab] = useState('scan'); 
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const onChangeTab = (tabName: string)=>{
        setSelectedTab(tabName);
        navigation.setOptions({title: tabs[tabName]});
    }

    return (
        <TabBar
            unselectedTintColor="#949494"
            barTintColor={backgroundStyle.backgroundColor}
            tintColor="#33A3F4">
        <TabBar.Item
            title="Scan"
            icon={<Icon name="scan" />}
            selected={selectedTab === 'scan'}
            onPress={() => onChangeTab('scan')}>
            <Scan/>
        </TabBar.Item>
        <TabBar.Item
            icon={<Icon name="database" />}
            title="Dashboard"
            selected={selectedTab === 'dashboard'}
            onPress={() => onChangeTab('dashboard')}>
            <Dashboard/>
        </TabBar.Item>
        <TabBar.Item
            icon={<Icon name="user" />}
            title="Profile"
            selected={selectedTab === 'profile'}
            onPress={() => onChangeTab('profile')}>
            <Profile/>
        </TabBar.Item>
        </TabBar>
    );
}
  
type homeProps = {
    navigation: {setOptions: (title: string)=>{}}
}

function Home(props: homeProps): React.JSX.Element {
    const {navigation} = props;
  return (
    <BottomMenu navigation={navigation}/>
  );
}

export default Home;
