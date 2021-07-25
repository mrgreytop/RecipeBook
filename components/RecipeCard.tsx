import React from "react";
import { View } from "react-native";
import {
    Headline, Chip, Button, Card
} from "react-native-paper"

export default function RecipeCard(props:any){
    const ing = props.item
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
                <Button icon="pencil">Edit</Button>
                <Button icon="trash-can">Delete</Button>
            </Card.Actions>
        </Card>
        // <View style = {{flex:1, flexDirection:"column"}}>
        //     <View>
        //         <Headline style = {{flex:1}}>{ing.name}</Headline>
        //     </View>
        //     <View style = {{flex:1}}>
        //         <View style={{ flex: 1, flexWrap: "wrap", minHeight:30 }}>
        //             {tags.map((t:any)=>{
        //                 return <Chip 
        //                     mode = "flat"
        //                 >{t.name}</Chip>
        //             })}
        //         </View>
        //     </View>
        //     <View>
        //         <List.Section>
        //             <List.Accordion title="Actions">
        //                 <List.Item 
        //                     title = "Edit" 
        //                     left = {(props)=>(
        //                         <List.Icon icon = "pencil"/>
        //                     )}
        //                 />
        //                 <List.Item 
        //                     title = "Delete"
        //                     left={(props) => (
        //                         <List.Icon icon="trash-can" />
        //                     )}
        //                 />
        //             </List.Accordion>
        //         </List.Section>
        //     </View>
        // </View>
    )
}