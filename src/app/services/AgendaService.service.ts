import { Marcacao } from './../models/Agenda';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class AgendaService{
    private readonly API= `${environment.API}/`;
    constructor(protected http: HttpClient) {}

    agendaCreate(array:Array<Marcacao>){
        return this.http
        .post(`${this.API}create_marcacao`,array)
        .pipe();
    }
    editMarcacao(array:Array<Marcacao>){
      return this.http
      .put(`${this.API}edit_marcacao`,array)
      .pipe();
    }
    last_marcacao(){
        return this.http
        .get(`${this.API}last_marcacao`)
        .pipe();
    }
    marcacaoList(id:number){
      return this.http
      .get(`${this.API}list_marcacao/${id}`)
      .pipe();
    }
    agendaTypeList(){
      return this.http
      .get(`${this.API}list_tipo_marcacao`)
      .pipe();
    }
    marcacaoDelete(marcacao:Marcacao){
      return this.http
      .put(`${this.API}delete_marcacao`,marcacao)
      .pipe();
    }
  }