import React, { useEffect, useState } from "react";
import {View, FlatList} from "react-native";
import {Text} from "react-native-paper";
import { RecipeDatabase } from "../Database";
import ListCard from "../components/ListCard";


export default function ListScreen(props:any){
    const [items, setItems] = useState<any>([])

    let recipeDb = RecipeDatabase()
    const initList = async()=>{
        return recipeDb.then(db=>{
            return db.readListIngredients()
        }).then(list=>{
            let init_items:any = [];
            list.ingredients.forEach((amounts,name)=>{
                init_items = [...init_items, ...amounts.map((a,i)=>{
                    return {
                        text:`${a.amount} ${a.unit.symbol} ${name}`,
                        key:`${name}${i}`
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
        <View style = {{flex:1}}>
            <FlatList
                data = {items}
                renderItem = {item=>{
                    return <ListCard {...item}></ListCard>
                }}
            >
            </FlatList>
        </View>
    )
}