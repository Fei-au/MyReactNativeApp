import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import AntIcon from 'react-native-vector-icons/AntDesign';


type image = {
    url: string,
    id: string | number,
}
export interface ImagePickerProps{
    files: Array<image>,
    onChange: (files: Array<image>)=>void,
    onAddImageClick: ()=>void,
}

function ImagePicker(props: ImagePickerProps){

    const {files, onChange} = props;

    const onDelete = (index: number)=>{
        const tempFiles = files.slice()
        tempFiles.splice(index, 1)
        return tempFiles
    }

    return (
        <View style={[styles.containerStyle]}>
            {
                files.map((ele, index)=>{
                    return <View key={ele.id}>
                        <Image
                            source={{uri: ele.url}}
                        />
                        <TouchableOpacity onPress={()=>onDelete(index)}>
                            <AntIcon name='closecircle' size={5} />
                        </TouchableOpacity>

                    </View>
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    containerStyle:{}

}) 

export default ImagePicker;