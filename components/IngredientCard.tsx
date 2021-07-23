import React from "react";
import { StyleSheet } from "react-native";
import {Text, Surface} from "react-native-paper";

export default function IngredientCard(props:any){
    let ing = props.item
    return (
        <Surface style={stylesheet.surface}>
            <Text style = {{...stylesheet.text, ...stylesheet.amount_bold}}>{`${ing.amount}${ing.unit} `}</Text>
            <Text style = {stylesheet.text}>{ing.name}</Text>
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
        flex:1,
        flexDirection: "row",
        elevation: 4,
        marginHorizontal: 5,
        marginVertical: 2,
        paddingHorizontal:5,
        paddingVertical:8
    }
})