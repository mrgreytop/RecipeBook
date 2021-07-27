import React from "react";
import { View } from "react-native";
import {
    Headline, Chip, Button, Card
} from "react-native-paper"
import { Recipe } from "../types";

export default function RecipeCard(props:any){
    const ing: Recipe = props.item
    const tags = ing.tags === undefined ? []:ing.tags;
    return (
        <Card>
            <Card.Title title = {ing.name}></Card.Title>
            <Card.Content>
                <View style={{ flex: 1, flexWrap: "wrap"}}>
                     {tags.map((t:any)=>{
                         return <Chip 
                             mode = "flat"
                         >{t.name}</Chip>
                     })}
                 </View>
            </Card.Content>
            <Card.Actions>
                <Button 
                    icon="pencil"
                    onPress={() => { props.clickThis(ing._id)}}
                >Edit</Button>
                <Button 
                    icon="trash-can" 
                    onPress = {()=>{props.removeThis(ing._id)}}
                >Delete</Button>
            </Card.Actions>
        </Card>
    )
}