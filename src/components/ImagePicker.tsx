import React, { useState } from "react";
import { Modal, Pressable } from "react-native";
import { Image, StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import AntIcon from 'react-native-vector-icons/AntDesign';


export type imageInPickerType = {
    url: string,
    id: string | number,
}

export interface ImagePickerProps {
    files: Array<imageInPickerType>,
    onChange: (files: Array<imageInPickerType>) => void,
    onAddImageClick: () => void,
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
console.log('screenWidth', screenWidth)
console.log('screenHeight', screenHeight)

function MyImagePicker(props: ImagePickerProps) {

    const [isVisible, setIsVisible] = useState(false);
    const [curIdx, setcurIdx] = useState(0);

    let { files, onChange } = props;
    files = files.concat(files)
    files = files.slice(0, 6)
    const onDelete = (index: number) => {
        const tempFiles = files.slice()
        tempFiles.splice(index, 1)
        return tempFiles
    }

    const imagePress = (index: number) => {
        setcurIdx(index);
        setIsVisible(true);
    }

    console.log('files', files)

    return (
        <View style={[styles.containerStyle]}>
            {
                files.map((ele, index) => {
                    return <TouchableOpacity key={ele.id} style={[styles.imageContainer]} onPress={() => { imagePress(index) }}>
                        <Image
                            style={[styles.image]}
                            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
                        />
                        <TouchableOpacity onPress={() => onDelete(index)} style={[styles.closeIcon]}>
                            <AntIcon name='closecircle' size={15} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                })
            }
            {
                isVisible ?
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isVisible}
                        onRequestClose={() => setIsVisible(false)}
                    >
                        <TouchableOpacity style={styles.fullScressContainer} onPress={()=>{setIsVisible(false)}}>
                            <Image
                                style={[styles.largeImage]}
                                source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    </Modal>
                    : null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    containerStyle: {
        // width: '100%',
        backgroundColor: 'red',
        flexDirection: 'row',
        flexWrap: 'wrap'
        // justifyContent: 'flex-start',
    },
    fullScressContainer: {
        // position: 'absolute',
        // width: screenWidth,
        // height: screenHeight,
        // zIndex: 1,
        // top: 0,
        // left: 0,
        // backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        // flexDirection: 'row',
        backgroundColor: 'black',
        width: '100%',
        height: '100%',
    },
    imageContainer: {
        margin: 5,
    },
    image: {
        width: 66,
        height: 66,
    },
    largeImage: {
        width: '100%',
        height: '100%',
    },
    closeIcon: {
        position: 'absolute',
        top: 2,
        right: 2,
    }

})

export default MyImagePicker;