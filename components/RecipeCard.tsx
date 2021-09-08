import React from "react";
import { View } from "react-native";
import {
    Headline, Chip, Button, Card
} from "react-native-paper"
import { Recipe } from "../types";

export default function RecipeCard(props:any){
    const recipe: Recipe = props.item
    const tags = recipe.tags === undefined ? []:recipe.tags;
    return (
        <Card>
            <Card.Title title = {recipe.name}></Card.Title>
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
                    onPress={() => { props.clickThis(recipe._id)}}
                >Edit</Button>
                <Button 
                    icon="trash-can" 
                    onPress = {()=>{props.removeThis(recipe._id)}}
                >Delete</Button>
                <Button
                    icon="playlist-plus"
                    onPress = {()=>{props.addThis(recipe._id)}}
                >Add to List</Button>
            </Card.Actions>
        </Card>
    )
}