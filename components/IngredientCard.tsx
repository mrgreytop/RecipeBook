import React, {useState} from "react";
import { View, TextInput as NativeTextInput } from "react-native";
import {
    TextInput
} from "react-native-paper";

export default function IngredientCard(props:any){

    const [name, setName] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [unit, setUnit] = useState<string>("");

    return (
        <View>
            <View>
                <TextInput
                    label = "name"
                    placeholder = "name"
                    value = {name}
                    onChangeText = {(text)=>setName(text)}
                    style = {{flex:3}}
                ></TextInput>
                <TextInput
                    label = "amount"
                    value = {amount}
                    onChangeText={(text) => setAmount(text)}
                    render = {(props)=>
                        <NativeTextInput
                            {...props}
                            keyboardType = "number-pad"
                        ></NativeTextInput>
                    }
                    style = {{flex:1}}
                ></TextInput>
                <TextInput
                    label = "unit"
                    value = {unit}
                    onChangeText = {(text)=>setUnit(text)}
                ></TextInput>
            </View>
        </View>
    )
}