import React, {useState} from 'react';
import { View, FlatList } from 'react-native';
import RecipeCard from '../components/RecipeCard';


export default function HomeScreen() {

    const [recipes, setRecipes] = useState<any>()

    return (
        <View>
            <FlatList
                data = {recipes}
                renderItem = {(p)=>{
                    return <RecipeCard {...p}/>
                }}
                keyExtractor={item=>item.id}
            >
            </FlatList>
        </View>
    )
}
