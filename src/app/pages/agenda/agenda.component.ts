import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { AgendaService } from './../../services/AgendaService.service';
import { Marcacao, Tipo_marcacao } from './../../models/Agenda';
import { ServicoService } from './../../services/ServicoService.service';
import { ClienteService } from './../../services/ClienteService.service';
import { Servico } from 'src/app/models/Servico';
import { Cliente } from './../../models/Cliente';
import { AgendaCreateComponent } from './agenda-create/agenda-create.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserService } from './../../services/UserService.service';
import { User, UserTipo } from './../../models/User';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
  isLoading = false;
  isEdit=false;
  last_ordem:number
  tipos_marcacao=new Array<Tipo_marcacao>();
  agendaList=new Array<Marcacao>()
  dataAtual=new Date();
  dataFuturo=(new Date()).setDate(this.dataAtual.getDate()+6)
  dias_semana=['Domingo','Segunda-Feira','Terça-Feira','Quarta-Feira','Quinta-Feira','Sexta-Feira','Sábado']
  dias_select=new Array<any>();
  userSelect=new User();
  users = new Array<User>();
  clientes = new Array<Cliente>();
  servicos=new Array<Servico>();
  formDateUser:FormGroup
  ordem_de_servico:number;
  @ViewChild("agendaCreate") agendaCreateModal: ModalDirective;
  @ViewChild("agendaCreateComponent") agendaCreateComponent: AgendaCreateComponent;

  
  constructor(private userService:UserService,
    private clienteService:ClienteService,
    private servicoService:ServicoService,
    private agendaService:AgendaService,
    private formBuilder:FormBuilder
    ) { }

  ngOnInit(): void {
    this.isLoading=true;
    this.setFormDateUser()  
    this.loadUsers()
    this.loadClientes()
    this.loadServicos() 
    this.loadAgenda()   
  }
  selectDays(date2:any){
    let date=new Date(date2)
    date.setDate(date.getDate()+1)
    this.dataFuturo=(new Date(date)).setDate(date.getDate()+6)
    this.dias_select=new Array<any>();
    this.dias_select.push({date:date,semana:this.dias_semana[date.getDay()]})
    let date_next=new Date(date)
    for(let i=1;i<7;i++){ 
      date_next.setDate(date_next.getDate()+1)
      this.dias_select.push({date:new Date(date_next),semana:this.dias_semana[date_next.getDay()]})
    }
  }
  setFormDateUser(){
    let data=`${this.dataAtual.getFullYear()}-${(this.dataAtual.getMonth()+1)<10?'0'+(this.dataAtual.getMonth()+1):this.dataAtual.getMonth()+1}-${this.dataAtual.getDate()<10?'0'+this.dataAtual.getDate():this.dataAtual.getDate()}`
    this.selectDays(data);
    this.formDateUser=this.formBuilder.group({
      date: new FormControl(data,Validators.required),
      user: new FormControl(4,Validators.required)
    })
  }
  loadServicesDay(date:Date){
    let array=this.agendaList.filter(r=>{
      let dta=new Date(r.Date);
      dta.setDate(dta.getDate()+1)
      return date.getTime()==dta.getTime()
    })
    return array
  }
  loadAgenda(){
    this.agendaService.marcacaoList().subscribe(response=>{
        this.isLoading = false;
        Object.assign(this.agendaList,response)
    }, (error) => {
      this.isLoading = false;
      console.log(error);
    })
    this.agendaService.agendaTypeList().subscribe(response=>{
      Object.assign(this.tipos_marcacao,response)
    }, (error) => {
      this.isLoading = false;
      console.log(error);
    })
  }
  loadLastMarcacao(){
    this.agendaService.last_marcacao().subscribe(
    (response:any)=>{
      this.last_ordem=response[0].max
    }, (error) => {
      this.isLoading = false;
      console.log(error);
    }
    )
  }
  loadUsers() {
    this.userService.userList().subscribe(
      (response) => {
        Object.assign(this.users, response);
        this.users=this.users.filter(r=>r.id_tipo==2 ||r.id_tipo==4)
        this.changeUser(this.users[0].id)
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }
  loadClientes() {
    this.clienteService.clienteList().subscribe(
      (response) => {
        Object.assign(this.clientes, response);
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }
  loadServicos() {
    this.servicoService.servicoList().subscribe(
      (response) => {
        Object.assign(this.servicos, response);
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }
  changeUser(idUser:number){
    this.userSelect=this.users.find(r=>r.id==idUser)
  }
  showTipoMarcacao(id:number){
    let tipo=this.tipos_marcacao.find(r=>r.id==id)
    return tipo?tipo.Nome:''
  }
  showCliente(id:number,nome:string){
    if(id){
      let cliente=this.clientes.find(r=>r.id==id)
      return cliente?cliente.Nome:''
    }else{
      return nome;
    }
  }
  showServicos(ids:string){
    let array=ids.split(',')
    let servicosString=[];
    this.servicos.forEach(r=>{
      if(array.includes(''+r.id)){
        servicosString.push(r.Nome)
      }
    })
    return servicosString.toString()
  }
  
  createMarcacao(array:Array<Marcacao>){
    this.agendaService.agendaCreate(array).subscribe((res:Array<Marcacao>)=>{
      Swal.fire(
        "Success",
        "Marcação #" + res[0].Ordem_de_servico + " criada com sucesso",
        "success"
      );
      this.loadUsers();
     },err=>{
      this.isLoading=false;
      Swal.fire(
        "Error",
        "Alguma coisa deu errado salvando a marcação",
        "error"
      );
     })
  }
  showCreateModal(id){
    if(id){      
    /*   Object.assign(this.userToEdit,this.users.find(r=>{ return r.id==id}))
      this.isEdit=true;
      this.userCreateComponent.setFormToEdit(); */
    }else{
      this.isEdit=false;
      this.loadLastMarcacao();
      this.agendaCreateComponent.setFormToCreate();

    }
    this.agendaCreateModal.show();
    this.agendaCreateModal.config.ignoreBackdropClick=true;
  }

}
