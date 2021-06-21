
export type Tag = {
    _id:number,
    name:string
}

export type Recipe = {
    _id:number,
    name:string,
    tags:Tag[]
}
