export class Marcacao{
    id:number;
    Date:any
    Hora_inicio:String
    Hora_fim:String
    Cliente_id:number
    Cliente_nome:String
    Usuario_id:number
    Servico_ids:String
    Valor:number
    Tipo_marcacao_id:number
    Ordem_de_servico:number
    createdAt:Date
    updateAt:Date
    dropIsActive=false;
}
export class Tipo_marcacao{
    id:number;
    Nome:String
}