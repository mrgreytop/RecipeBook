import React from "react";
import { View } from "react-native";
import {
    Text, Chip, Button
} from "react-native-paper"

export default function RecipeCard(props:any){
    const ing = props.item
    const tags = ing.tags === undefined ? []:ing.tags;
    return (
        <View style = {{flex:1, flexDirection:"column"}}>
            <View>
                <Text style = {{flex:1}}>{ing.name}</Text>
                <Button>Edit</Button>
            </View>
            <View style = {{flex:1}}>
                <View style={{ flex: 1, flexWrap: "wrap" }}>
                    {tags.map((t:any)=>{
                        return <Chip 
                            mode = "flat"
                        >{t.name}</Chip>
                    })}
                </View>
                <Button>Delete</Button>
            </View>
        </View>
    )
}