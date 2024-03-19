import { Text, View } from "@ant-design/react-native";
import React, { useEffect, useRef, useState } from "react";
import { commonStyles } from "../../styles/styles";
import { ActivityIndicator, Alert, FlatList, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { itemType, userType } from "../../utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { delete_item, get_last_items } from "../../services/inventory";
import { errorHandler } from "../../utils/errorHandler";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PressableOpacity } from "react-native-pressable-opacity";
import { Modal, Button } from "native-base";

interface propsType extends itemType {
	dlt: ()=>void
}

function Item (props: propsType){
	const {title, images, item_number, location, dlt} = props;

	const onPressHandler = ()=>{
		dlt();
	}

	return (
		<View style={[commonStyles.row, styles.itemContainer]}>
			<Image source={{uri:images?.[0]?.full_image_url}} style={[styles.image]}/>
			<View style={[styles.textContainer]}>
				<Text ellipsizeMode="tail" style={[styles.text, styles.marginBottom]} numberOfLines={1}>
					{title}
				</Text>
				<Text ellipsizeMode="tail" numberOfLines={1} style={[styles.text,]}>
					Item_number: {item_number}. Location: {location}
				</Text>
			</View>
			<TouchableOpacity onPress={onPressHandler}>
			<View style={[{flex: 1, justifyContent: 'center'}]}>
				<MaterialCommunityIcons name='delete' size={20}/>
			</View>
			</TouchableOpacity>
		</View>
	);
}

function Dashboard (){
	const userRef = useRef<userType>({});
	const pageRef = useRef(1);
	const [items, setItems] = useState<Array<itemType>>([]);
	const [isFetching, setIsFetching] = useState(false);
	const [allDataFetched, setAllDataFetched] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const modalIdRef = useRef(-1);

	useEffect(()=>{
		const func = async()=>{
			try{
				setIsFetching(true);
				const ur = await AsyncStorage.getItem('user');
				userRef.current = JSON.parse(ur as string);
				const pml = [];
				pml.push(get_last_items(userRef.current.staff_id, pageRef.current++))
				pml.push(get_last_items(userRef.current.staff_id, pageRef.current++))
				const resl = await Promise.all(pml); 
				const [res, res2] = resl;
				if(res.length === 0 || res2.length === 0){
					setAllDataFetched(true);
				}else{
					setItems([...res, ...res2]);
				}
				setIsFetching(false);
			}catch(err){
				errorHandler(err);
			}finally{
				setIsFetching(false);
			}
		}
		func()
	}, [])


	const fetchData = async(itm = items)=>{
		try{
			if (isFetching || allDataFetched) return;
			setIsFetching(true);
			const res = await get_last_items(userRef.current.staff_id, pageRef.current++);
			if(res.length === 0){
				setAllDataFetched(true);
				return;
			}else{
				setItems([...itm, ...res]);
			}
			setIsFetching(false);
		}catch(err){
			errorHandler(err);
			setIsFetching(false);
		}
	}
	const renderFooter = () => {
		if (!isFetching) return null;
		return <ActivityIndicator/>;
	};

	const handleDeleteItem = (id: number)=>{
		setModalVisible(true);
		modalIdRef.current = id
	}

	const deleteItem = async ()=>{
		try{
			await delete_item(modalIdRef.current)
			setModalVisible(false);
			pageRef.current = 1;
			await fetchData([]);
		}catch(err){
			errorHandler(err);
			setModalVisible(false);
		}
	}

	return(
		<SafeAreaView style={styles.container}>
			<FlatList
				data={items}
				renderItem={({item}) => <Item {...item} dlt={()=>{handleDeleteItem(item.id)}}/>}
				keyExtractor={item => String(item.id)}
				onEndReached={(info)=>fetchData()}
				onEndReachedThreshold={0.5}
				ListFooterComponent={renderFooter} // Render a loading indicator at the bottom
			/>
			<Modal
				isOpen={modalVisible}
				onClose={setModalVisible}
				size={'sm'}
			>
				<Modal.Content>
				<Modal.CloseButton />
				<Modal.Header>Return Policy</Modal.Header>
				<Modal.Body>
					<View>
						<Text style={{fontSize: 16}}>Confirm to delete the item?</Text>
					</View>
				</Modal.Body>
				<Modal.Footer>
					<Button.Group space={2}>
					<Button variant="ghost" colorScheme="blueGray" onPress={() => {
						setModalVisible(false);
					}}>
						Cancel
					</Button>
					<Button onPress={() => {
						deleteItem();
					}}>
						Ok
					</Button>
					</Button.Group>
				</Modal.Footer>
				</Modal.Content>
			</Modal>
	  </SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	//   paddingTop: StatusBar.currentHeight,
	  paddingTop: 10,
	  backgroundColor: '#E8E9E8',
	},
	itemContainer:{
		backgroundColor: 'white',
		marginLeft: 10,
		marginRight	: 10,
		marginBottom: 10,
		padding: 10,
		borderRadius: 5

	},
	textContainer:{
		flex: 10,
		justifyContent: 'flex-start',
		// padding: 20
	},
	marginBottom:{
		marginBottom: 10,
	},
	text: {
		fontSize: 12,
	  	width: '100%',
	},
	image:{
		width: '15%',
		resizeMode: 'contain',
		marginRight: 10,
	},
	fixToText: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 10,
		paddingHorizontal: 20,
		paddingVertical: 10,
		width: '70%',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
		  width: 0,
		  height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	  },
  });
  

export default Dashboard;