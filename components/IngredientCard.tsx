import React, {useState, useRef, useEffect} from "react";
import { NativeSyntheticEvent, Pressable, StyleSheet, TextInputSubmitEditingEventData, View } from "react-native";
import {Text, Surface, TextInput} from "react-native-paper";

type onTextSubmit = NativeSyntheticEvent<TextInputSubmitEditingEventData>

export default function IngredientCard(props:any){
    const [edit, setEdit] = useState<boolean>(false);
    const textInputRef = useRef<any>();
    let ing = props.item;

    useEffect(()=>{
        if (
            edit == true &&
            textInputRef.current !== undefined && 
            textInputRef.current !== null
        ) {
            textInputRef.current.focus()
        }
    }, [edit])

    const onSubmitEditing = (ev:onTextSubmit)=>{
        props.onEdit({key:ing.key, ...ev});
        setEdit(false);
    }

    return (
        <Surface style={stylesheet.surface}>
            <View style = {stylesheet.flexRow}>
                <View style = {{flex:1}}>
                    {edit ?
                        <TextInput 
                            defaultValue={parseFloat(ing.amount) + ing.unit + " " + ing.name}
                            onSubmitEditing={onSubmitEditing}
                            onBlur={onSubmitEditing}
                            ref = {textInputRef}
                        ></TextInput> :
                        <Pressable
                            onPress = {()=>setEdit(true)}
                        >
                            <View style={stylesheet.flexRow}>
                                <Text style={{ ...stylesheet.text, ...stylesheet.amount_bold }}>{`${ing.amount}${ing.unit} `}</Text>
                                <Text style={stylesheet.text}>{ing.name}</Text>
                            </View>
                        </Pressable>
                    }
                </View>
                <Text style={{ marginHorizontal: 5 }}>D</Text>
            </View>
        </Surface>
    )
}

const stylesheet = StyleSheet.create({
    amount_bold:{
        fontWeight:"bold"
    },
    text: {
        fontSize:16
    },
    surface: {
        elevation: 4,
        marginHorizontal: 5,
        marginVertical: 2,
        paddingHorizontal:5,
        paddingVertical:8
    },
    flexRow: {
        flex: 1,
        flexDirection: "row",
    }
})