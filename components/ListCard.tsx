import React, { useState } from "react";
import { View } from "react-native";
import { Divider, TouchableRipple, Subheading } from "react-native-paper";

export default function ListCard(props:any){
    const item = props.item;
    const [isStrike, setIsStrike] = useState<boolean>(false);

    return (
        <View>
            <TouchableRipple
                onPress = {()=>setIsStrike(!isStrike)}
            >
                <Subheading style = {{
                    flex: 1, margin: 5, padding: 5,
                    textDecorationLine:isStrike ? "line-through":"none"
                }}>{item.text}</Subheading>
            </TouchableRipple>
            <Divider/>
        </View>
    )
}