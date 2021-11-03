import React, { useContext, useEffect, useState } from "react";
import {View, FlatList} from "react-native";
import { IRecipeDatabase, RecipeDatabaseContext } from "../Database";
import ListCard from "../components/ListCard";
import { ListIngredient } from "../types";

//TODO 'update' list button
//TODO 'reset' list button

export default function ListScreen(props:any){
    const [items, setItems] = useState<any>([])

    const {db, setListeners} = useContext(RecipeDatabaseContext);

    useEffect(()=>{
        setListeners([])
    }, [])

    const initList = async()=>{
        return db.then((db: IRecipeDatabase)=>{
            return db.readListIngredients()
        }).then((list: ListIngredient)=>{
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