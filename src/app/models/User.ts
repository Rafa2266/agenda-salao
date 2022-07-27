export class UserLogin{
    Email:String
    password:String   
}
export class UserTipo{
    id:number
    Nome:String   
}
export class User{
    id:number;
    Nome:String;
    CPF:String;
    id_tipo: number;
    Telefone:String;
    Email:String;
    createdAt:Date
    updateAt:Date
}
export class UserToCreate{
    id:number;
    Nome:String;
    CPF:String;
    password:String;
    id_tipo: number;
    Telefone:String;
    Email:String;
    createdAt:Date
    updateAt:Date
}