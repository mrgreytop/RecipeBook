import React, { useState } from "react";
import { View, TextInput as NativeTextInput } from "react-native";
import { TextInput } from "react-native-paper"

const known_units = [
    "kg","g","oz","lb","pounds","ounces"
]

export default function IngredientForm(){

    const [ingText, setIngText] = useState<string>("");

    const parseIngredientEntry = (entryText:string)=>{
        console.log(entryText);
        let unit_regex = RegExp(known_units.join("|"))
        let amount_regex = RegExp("[0-9\.]")

        let units = entryText.match(unit_regex)
        let amount = entryText.match(amount_regex)
    }

    return (
        <View>
            <TextInput
                onChangeText = {(text)=>{setIngText(text)}}
                value = {ingText}
                render = {(props)=>{
                    return (
                        <NativeTextInput
                            {...props} 
                            onEndEditing={(e) => { 
                                parseIngredientEntry(e.nativeEvent.text) 
                            }}
                        ></NativeTextInput>
                    )
                }}
            ></TextInput>
        </View>
    )
}