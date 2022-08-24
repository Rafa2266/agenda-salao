import { User } from './../../../models/User';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Marcacao } from './../../../models/Agenda';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'agenda-intervalo',
  templateUrl: './agenda-intervalo.component.html',
  styleUrls: ['./agenda-intervalo.component.scss']
})
export class AgendaIntervaloComponent implements OnInit {
  @Output() onCloseModal = new EventEmitter<void>();
  @Output() onCreateIntervalo= new EventEmitter<Array<Marcacao>>();
  @Output() onEditIntervalo= new EventEmitter<Marcacao>();
  @Input() agendaList:Array<Marcacao>
  @Input() isEdit: boolean;
  @Input() userSelect: User;
  agendaListToVerify:Array<Marcacao>
  message: String;
  intervaloToEdit=new Marcacao();
  formIntervalo: FormGroup;
  dateIntervalo:Date=null;
  


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.setFormToCreate();
  }
  setFormToCreate(){
    this.agendaListToVerify=new Array<Marcacao>();
    Object.assign(this.agendaListToVerify,this.agendaList)
    this.formIntervalo=this.formBuilder.group({
      hora_inicio: new FormControl(null, Validators.required),
      hora_fim: new FormControl(null, Validators.required),
      date_ini: new FormControl(null, Validators.required),
      date_fim: new FormControl(null, Validators.required),
    })
  }
  setFormToEdit(marcacao:Marcacao){
    this.intervaloToEdit=new Marcacao();
    Object.assign(this.intervaloToEdit,marcacao);
    this.agendaListToVerify=new Array<Marcacao>();
    Object.assign(this.agendaListToVerify,this.agendaList);
    this.agendaListToVerify=this.agendaListToVerify.filter(r=>r.id!=marcacao.id && r.Date==marcacao.Date);
    this.dateIntervalo=new Date(marcacao.Date);
    this.dateIntervalo.setDate(this.dateIntervalo.getDate()+1)
    this.formIntervalo=this.formBuilder.group({
      hora_inicio: new FormControl(marcacao.Hora_inicio, Validators.required),
      hora_fim: new FormControl(marcacao.Hora_fim, Validators.required),
    })
  }
  editIntervalo(){
    if(this.formIntervalo.valid){
      if ((new Date('2022-01-01 ' + this.formIntervalo.value.hora_inicio)).getTime()<(new Date('2022-01-01 ' + this.formIntervalo.value.hora_fim)).getTime()) {
        this.intervaloToEdit.Hora_inicio=this.formIntervalo.value.hora_inicio;
        this.intervaloToEdit.Hora_fim=this.formIntervalo.value.hora_fim;
        if(this.verifyConflitoAgenda([this.intervaloToEdit])){
          this.onEditIntervalo.emit(this.intervaloToEdit);
          this.closeModal();
        }
      }else{
        this.message = 'Horário do início do intervalo tem que ser menor do que o do fim';
      }
    }
  }
  createIntervalo(){
    if(this.formIntervalo.valid){
      if ((new Date('2022-01-01 ' + this.formIntervalo.value.hora_inicio)).getTime()<(new Date('2022-01-01 ' + this.formIntervalo.value.hora_fim)).getTime()) {
          if( (new Date(this.formIntervalo.controls['date_ini'].value))<=(new Date(this.formIntervalo.controls['date_fim'].value))){
            let dateInicial=new Date(this.formIntervalo.controls['date_ini'].value)
            dateInicial.setDate(dateInicial.getDate()+1)
            let dateFim=new Date(this.formIntervalo.controls['date_fim'].value)
            dateFim.setDate(dateFim.getDate()+1)
            let intervaloArray=new Array<Marcacao>()
            for(let date=new Date(dateInicial);date<=dateFim;date.setDate(date.getDate()+1)){
              console.log(date)
              let intervalo=new Marcacao();
              intervalo.Date=`${date.getFullYear()}-${(date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1}-${date.getDate()<10?'0'+date.getDate():date.getDate()}`;
              intervalo.Hora_inicio=this.formIntervalo.value.hora_inicio;
              intervalo.Hora_fim =this.formIntervalo.value.hora_fim;
              intervalo.Tipo_marcacao_id=2;
              intervalo.Usuario_id=this.userSelect.id;
              intervalo.Cliente_id=null;
              intervalo.Cliente_nome=null;
              intervalo.Ordem_de_servico=null;
              intervalo.Servico_ids=null;
              intervalo.Valor=null;
              intervaloArray.push(intervalo);
            }
            if(this.verifyConflitoAgenda(intervaloArray)){
              this.onCreateIntervalo.emit(intervaloArray)
              console.log(intervaloArray)
              this.closeModal()
            }
          
          }else{
            this.message = 'A data de começo da marcação do intervalo tem que ser menor ou igual a data de finalização da marcação do intervalo';
          }
     

      }else{
        this.message = 'Horário do início do intervalo tem que ser menor do que o do fim';
      }
    }
  }
  verifyConflitoAgenda(array:Array<Marcacao>){
    
    for(let a=0;a<array.length;a++){
      let hourBegin=(new Date(array[a].Date+' 9:00'))
      let hourEnd=(new Date(array[a].Date+' 19:00'))
      let agendaDay=this.agendaListToVerify.filter(r=>r.Date==array[a].Date)
      let hourInicio=(new Date(array[a].Date+' '+array[a].Hora_inicio))
      let hourFim=(new Date(array[a].Date+' '+array[a].Hora_fim))
      if(hourBegin>hourInicio || hourInicio>=hourEnd ){
        this.message='Intervalo fora do horário de funcionamento'
        return false;
      }
      let marcaErro=agendaDay.find(r=>{
        let hourInicioList=(new Date(r.Date+' '+r.Hora_inicio))
        let hourFimList=(new Date(r.Date+' '+r.Hora_fim))

        return (((hourInicio>=hourInicioList && hourFimList>hourInicio)||
               (hourInicio<hourInicioList && hourFim>hourInicioList))) &&
                (r.Tipo_marcacao_id!=1 && array[a].Tipo_marcacao_id!=1)
      })
      if(marcaErro){
        console.log(marcaErro)
        console.log(array)
        this.message='Este funcionário já possui uma marcação ou intervalo nesse horário'
        return false;
      }
    }
    return true;
  }
  closeModal() {
    this.message='';
    this.intervaloToEdit=null;
    this.dateIntervalo=null;
    this.formIntervalo.reset()
    this.onCloseModal.emit();
  }

}
