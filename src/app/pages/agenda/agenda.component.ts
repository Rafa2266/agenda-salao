import { AgendaIntervaloComponent } from './agenda-intervalo/agenda-intervalo.component';
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
import { User} from './../../models/User';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
  isLoading = false;
  isEdit:boolean;
  isEditIntervalo:boolean;
  last_ordem:number
  tipos_marcacao=new Array<Tipo_marcacao>();
  agendaList=new Array<Marcacao>()
  dataAtual=new Date();
  dataFuturo=(new Date()).setDate(this.dataAtual.getDate()+6)
  dias_semana=['Domingo','Segunda-Feira','Terça-Feira','Quarta-Feira','Quinta-Feira','Sexta-Feira','Sábado']
  dias_select=new Array<any>();
  userSelect=new User();
  users = new Array<User>();
  userAtual:User
  clientes = new Array<Cliente>();
  servicos=new Array<Servico>();
  formDateUser:FormGroup
  @ViewChild("agendaCreate") agendaCreateModal: ModalDirective;
  @ViewChild("agendaCreateComponent") agendaCreateComponent: AgendaCreateComponent;
  @ViewChild("agendaIntervalo") agendaIntervaloModal: ModalDirective;
  @ViewChild("agendaIntervaloComponent") agendaIntervaloComponent: AgendaIntervaloComponent;

  
  constructor(private userService:UserService,
    private session:LocalStorageService,
    private clienteService:ClienteService,
    private servicoService:ServicoService,
    private agendaService:AgendaService,
    private formBuilder:FormBuilder
    ) { }

  ngOnInit(): void {
    this.isLoading=true;
    this.loadUsers()
    this.loadClientes()
    this.loadServicos() 
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
  setFormDateUser(id:number){
    let data=`${this.dataAtual.getFullYear()}-${(this.dataAtual.getMonth()+1)<10?'0'+(this.dataAtual.getMonth()+1):this.dataAtual.getMonth()+1}-${this.dataAtual.getDate()<10?'0'+this.dataAtual.getDate():this.dataAtual.getDate()}`
    this.selectDays(data);
    this.formDateUser=this.formBuilder.group({
      date: new FormControl(data,Validators.required),
      user: new FormControl(id,Validators.required)
    })
  }
  loadServicesDay(date:Date){
    let array=new Array<Marcacao>()
    Object.assign(array,this.agendaList)
    array=array.filter(r=>{
      let dta=new Date(r.Date);
      dta.setDate(dta.getDate()+1)
      return date.getTime()==dta.getTime()
    })
    function compararHora(a:Marcacao,b:Marcacao){
      if(new Date('2022-01-01 '+a.Hora_fim)>new Date('2022-01-01 '+b.Hora_fim)){
        return 1;
      }else{
        return -1;
      }
    }
    array=array.sort(compararHora);
    let arrayPausa=new Array<Marcacao>();
      for(let i=0;i<array.length-1;i++){
      let hourInicio=new Date('2022-01-01 '+array[i].Hora_inicio)
      let hourFim=new Date('2022-01-01 '+array[i].Hora_fim)
      let hourInicioNext=new Date('2022-01-01 '+array[i+1].Hora_inicio)
      let hourFimNext=new Date('2022-01-01 '+array[i+1].Hora_fim)
       if((hourInicio.getTime()>=hourInicioNext.getTime() && hourFimNext.getTime()<hourInicio.getTime())||
      (hourInicio.getTime()<hourInicioNext.getTime() && hourFim.getTime()>=hourInicioNext.getTime())){
       if(array[i].Tipo_marcacao_id==1){
          arrayPausa.push(array[i])
        }else if(array[i+1].Tipo_marcacao_id==1){
          arrayPausa.push(array[i+1])
        }
      }  
    }  
    array=array.filter(r=>!arrayPausa.includes(r))
    
    let arrayLivre=new Array<Marcacao>();
    for(let i=0;i<array.length;i++){
      if(i==0 && new Date('2022-01-01 '+array[i].Hora_inicio)>new Date('2022-01-01 9:00')){
          let tempo_livre=new Marcacao();
          tempo_livre.Hora_inicio='9:00'
          tempo_livre.Hora_fim=array[i].Hora_inicio
          tempo_livre.Tipo_marcacao_id=4;
          arrayLivre.push(tempo_livre)
      }
      if(i<array.length-1){
        if(array[i].Hora_fim!=array[i+1].Hora_inicio){
          let tempo_livre=new Marcacao();
          tempo_livre.Hora_inicio=array[i].Hora_fim
          tempo_livre.Hora_fim=array[i+1].Hora_inicio
          let hourInicio=new Date('2022-01-01 '+tempo_livre.Hora_inicio)
          let hourFim=new Date('2022-01-01 '+tempo_livre.Hora_fim)
          let pausa=arrayPausa.find(r=>{
            let hourInicioPausa=new Date('2022-01-01 '+r.Hora_inicio)
            let hourFimPausa=new Date('2022-01-01 '+r.Hora_fim)
            return hourInicio.getTime()>=hourInicioPausa.getTime() && hourFim.getTime()<=hourFimPausa.getTime()
          })
          if(pausa){
            tempo_livre.Cliente_id=pausa.Cliente_id
            tempo_livre.Servico_ids=pausa.Servico_ids
            tempo_livre.Ordem_de_servico=pausa.Ordem_de_servico
            tempo_livre.Valor=pausa.Valor
            tempo_livre.Tipo_marcacao_id=1;
          }else{
            tempo_livre.Tipo_marcacao_id=4;  
          }
          arrayLivre.push(tempo_livre)
        }
      
      }else{
        if(new Date('2022-01-01 '+array[i].Hora_fim)<new Date('2022-01-01 19:00')){
          let tempo_livre=new Marcacao();
          tempo_livre.Hora_inicio=array[i].Hora_fim;
          tempo_livre.Hora_fim='19:00'
          tempo_livre.Tipo_marcacao_id=4;
          arrayLivre.push(tempo_livre)
        }
      }
    }
    array=array.concat(arrayLivre);
    array=array.sort(compararHora)
    if(array.length<=0){
      let tempo_livre=new Marcacao();
      tempo_livre.Hora_inicio='9:00';
      tempo_livre.Hora_fim='19:00'
      tempo_livre.Tipo_marcacao_id=4;
      array.push(tempo_livre)
    }
    return array
  }
  showInfoService(service:Marcacao){
    if(service.Tipo_marcacao_id!=1){
      service.dropIsActive= !service.dropIsActive
    }
  }
  loadAgenda(id:number){
    
    this.agendaService.marcacaoList(id).subscribe((response:Array<any>)=>{
        this.agendaList=new Array<Marcacao>();
        this.isLoading = false;
        response.forEach(r=>{
          r.Valor=parseFloat(r.Valor)
          this.agendaList.push(r);
        })
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
        let user:User =this.session.get('user')
        this.userAtual=user
        let id=this.users.find(r=>r.id_tipo==2).id
        if(this.users.find(r=>r.id==user.id)){
          id=user.id
        }
        this.setFormDateUser(id)  
        this.changeUser(id)
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
      (response:Array<any>) => {
        this.servicos=new Array<Servico>()
        response.forEach(r=>{
          r.Valor_recomendado=parseFloat(r.Valor_recomendado)
          this.servicos.push(r);
        })
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }
  changeUser(idUser:number){
    this.userSelect=this.users.find(r=>r.id==idUser)
    this.loadAgenda(idUser)
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
  deleteMarcacao(marcacao:Marcacao){
    let message;
    if(marcacao.Ordem_de_servico){
      message=`Você está prestes a deletar a marcação ${marcacao.Ordem_de_servico} da agenda`;
    }else{
      let date=new Date(marcacao.Date)
      date.setDate(date.getDate()+1)
      let dateFormat=`${date.getDate()<10?'0'+date.getDate():date.getDate()}/${(date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1}/${date.getFullYear()}`
      message=`Você está prestes a deletar um intervalo do dia ${dateFormat} das ${marcacao.Hora_inicio} até as ${marcacao.Hora_fim} na agenda`;
    }
    Swal.fire({ 
     //'warning',
     title:"Tem certeza?",
     text:message,
     showCancelButton: true,
    }).then(result=>{
      if(result.value){
        this.isLoading=true;
        if(marcacao.Ordem_de_servico!=null){
          this.agendaService.marcacaoDelete(marcacao).subscribe(response=>{
                  this.isLoading=false;
                  Swal.fire(
                    "Success",
                    "Marcação na agenda deletada com sucesso",
                    "success"
                  );
                  this.agendaList=this.agendaList.filter(r=>r.Ordem_de_servico!=marcacao.Ordem_de_servico)
                  });
        }else{
          this.agendaService.intervaloDelete(marcacao).subscribe(response=>{
            this.isLoading=false;
            Swal.fire(
              "Success",
              "Intervalo na agenda deletada com sucesso",
              "success"
            );
            this.agendaList=this.agendaList.filter(r=>r.id!=marcacao.id)
            });
        }
        
        
      }
    },err=>{
     this.isLoading=false;
     Swal.fire(
       "Error",
       "Alguma coisa deu errado deletando a marcação na agenda",
       "error"
     );
    })
 
   }
  createMarcacao(array:Array<Marcacao>){
    this.isLoading=true;
    this.agendaService.agendaCreate(array).subscribe((res:Array<Marcacao>)=>{
      this.isLoading=false;
      if(res[0].Ordem_de_servico!=2){
        Swal.fire(
          "Success",
          "Marcação #" + res[0].Ordem_de_servico + " criada com sucesso",
          "success"
        );
      }else{
        Swal.fire(
          "Success",
          "Intervalos criados com sucesso",
          "success"
        );
      }
     /*  if(res[0].Ordem_de_servico){
        array.forEach(r=>{
          this.agendaList.push(r)
        })
      }else{ */
        this.loadAgenda(this.userSelect.id)
     // }
      
     },err=>{
      this.isLoading=false;
      Swal.fire(
        "Error",
        "Alguma coisa deu errado salvando a marcação ou intervalo",
        "error"
      );
     })
  }
  editIntervalo(marcacao:Marcacao){
    this.isLoading=true;
    let date=new Date(marcacao.Date)
    date.setDate(date.getDate()+1)
    let dateFormat=`${date.getDate()<10?'0'+date.getDate():date.getDate()}/${(date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1}/${date.getFullYear()}`
    let message=`Intervalo do dia ${dateFormat} das ${marcacao.Hora_inicio} até as ${marcacao.Hora_fim} editado com sucesso`;
    this.agendaService.intervaloEdit(marcacao).subscribe((response:Marcacao)=>{
      this.isLoading=false;
      Swal.fire(
        "Success",
        message,
        "success"
      );
      this.agendaList=this.agendaList.filter(r=>r.id!=response.id)
      this.agendaList.push(response)
    },err=>{
      this.isLoading=false;
      Swal.fire(
        "Error",
        "Alguma coisa deu errado salvando o intervalo",
        "error"
      );
     })
  }
  editMarcacao(array:Array<Marcacao>){
    this.agendaService.editMarcacao(array).subscribe(response=>{
      this.isLoading=false;
      Swal.fire(
        "Success",
        "Marcação #" + response[0].Ordem_de_servico + " editada com sucesso",
        "success"
      );
    /*   this.agendaList=this.agendaList.filter(r=>r.Ordem_de_servico!=response[0].Ordem_de_servico)
      array.forEach(r=>{
        this.agendaList.push(r)
      }) */
      this.loadAgenda(this.userSelect.id)
     },err=>{
      this.isLoading=false;
      Swal.fire(
        "Error",
        "Alguma coisa deu errado salvando a marcação",
        "error"
      );
     })
  }
  showCreateModal(ordem){
    if(ordem){ 
      this.isEdit=true;
      let marcacaoToEdit=this.agendaList.filter(r=> r.Ordem_de_servico==ordem)
      this.agendaCreateComponent.setFormToEdit(marcacaoToEdit); 
    }else{
      this.isEdit=false;
      this.loadLastMarcacao();
      this.agendaCreateComponent.setFormToCreate();
    }
    this.agendaCreateModal.show();
    this.agendaCreateModal.config.ignoreBackdropClick=true;
  }

  showIntervaloModal(id){
    if(id){ 
      this.isEditIntervalo=true;
      let marcacaoToEdit=this.agendaList.find(r=> r.id==id)
      this.agendaIntervaloComponent.setFormToEdit(marcacaoToEdit); 
    }else{
      this.isEditIntervalo=false;
      this.agendaIntervaloComponent.setFormToCreate();
    }
    this.agendaIntervaloModal.show();
    this.agendaIntervaloModal.config.ignoreBackdropClick=true;
  }

}
