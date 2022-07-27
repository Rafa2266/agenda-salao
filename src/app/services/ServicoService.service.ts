import { Servico } from './../models/Servico';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
  })
  export class ServicoService{
    private readonly API= `${environment.API}/`;
    constructor(protected http: HttpClient) {}
    servicoList(){
        return this.http
        .get(`${this.API}list_servico`)
        .pipe();
      }
      servicoCreate(servico:Servico){
        return this.http
        .post(`${this.API}create_servico`,servico)
        .pipe();
      }
      servicoEdit(servico:Servico){
        return this.http
        .put(`${this.API}edit_servico`,servico)
        .pipe();
      }
      servicoDelete(servico:Servico){
        return this.http
        .put(`${this.API}delete_servico`,servico)
        .pipe();
      }
  }