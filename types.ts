
export type Tag = {
    _id:number,
    name:string
}

enum Measure{
    Weight,
    Volume,
    Length
}

export type Unit = {
    symbol:string,
    measure:Measure
}

export type RecipeIngredient = {
    name: string,
    amount: number,
    unit: string
}

export type Recipe = {
    _id:number,
    name:string,
    servings:number,
    tags:Tag[],
    ingredients:RecipeIngredient[]
}
