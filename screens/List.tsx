import React, { useEffect, useState } from "react";
import {View, FlatList} from "react-native";
import {Text} from "react-native-paper";
import { RecipeDatabase } from "../Database";


export default function ListScreen(props:any){
    const [items, setItems] = useState<any>([])

    let recipeDb = RecipeDatabase()
    const initList = async()=>{
        return recipeDb.then(db=>{
            return db.readListIngredients()
        }).then(list=>{
            let init_items:any = [];
            list.ingredients.forEach((amounts,name)=>{
                init_items = [...init_items, ...amounts.map(a=>{
                    return {
                        text:`${a.amount.toPrecision(2)} ${a.unit.symbol} ${name}`
                    }
                })]
            })
            setItems(init_items)
        })
    }

    useEffect(()=>{
        initList()
    },[])

    return (
        <View style = {{flex:1, width:100, height:100}}>
            <FlatList
                data = {items}
                renderItem = {item=>{
                    return <Text>{item.item.text}</Text>
                }}
            >
            </FlatList>
        </View>
    )
}