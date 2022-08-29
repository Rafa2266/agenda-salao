import { Marcacao } from './../../../models/Agenda';
import { Servico } from 'src/app/models/Servico';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User } from 'src/app/models/User';
import { Cliente } from 'src/app/models/Cliente';

@Component({
  selector: 'agenda-create',
  templateUrl: './agenda-create.component.html',
  styleUrls: ['./agenda-create.component.scss'],
})
export class AgendaCreateComponent implements OnInit {
  @Output() onCloseModal = new EventEmitter<void>();
  @Input() isEdit: boolean;
  @Input() last_ordem: number;
  @Input() userSelect: User;
  @Input() dataAtual: Date;
  @Input() agendaList:Array<Marcacao>
  agendaListToVerify:Array<Marcacao>
  @Input() servicos: Array<Servico>;
  @Input() clientes: Array<Cliente>;
  ordem_de_servico: number;
  @Output() onCreateMarcacao = new EventEmitter<Array<Marcacao>>();
  @Output() onEditMarcacao = new EventEmitter<Array<Marcacao>>();
  horaInicial: String;
  horaFinal: String;
  servicosSelect = new Array<Servico>();
  hasPause: boolean;
  clienteIsNotRegister: boolean;
  createMarcacaoArray=new Array<Marcacao>();
  formAgenda: FormGroup;
  message: String;
  pauses = new Array<number>();
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.setFormToCreate();
  }

  setFormToCreate() {
    this.agendaListToVerify=new Array<Marcacao>();
    Object.assign(this.agendaListToVerify,this.agendaList)
    this.formAgenda = this.formBuilder.group({
      cliente: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      hora_inicio: new FormControl(null, Validators.required),
      hora_fim: new FormControl(null, Validators.required),
      servicos: new FormControl(null, Validators.required),
      valor: new FormControl(null, Validators.required),
      hasPause: new FormControl(false),
      clienteIsNotRegister: new FormControl(false),
    });
  }
  setFormToEdit(marcacaoToEdit:Array<Marcacao>) {
    this.agendaListToVerify=new Array<Marcacao>();
    this.ordem_de_servico=marcacaoToEdit[0].Ordem_de_servico
    Object.assign(this.agendaListToVerify,this.agendaList)
    let servicos=(marcacaoToEdit[0].Servico_ids.split(',')).map(r=>Number(r))
    this.agendaListToVerify=this.agendaListToVerify.filter(r=>r.Ordem_de_servico!=marcacaoToEdit[0].Ordem_de_servico)
    this.clienteIsNotRegister=!!marcacaoToEdit[0].Cliente_nome
    this.changeValue(servicos)
    this.formAgenda = this.formBuilder.group({
      cliente: new FormControl(this.clienteIsNotRegister?marcacaoToEdit[0].Cliente_nome:marcacaoToEdit[0].Cliente_id, Validators.required),
      date: new FormControl(marcacaoToEdit[0].Date, Validators.required),
      hora_inicio: new FormControl(marcacaoToEdit[0].Hora_inicio, Validators.required),
      hora_fim: new FormControl(marcacaoToEdit[marcacaoToEdit.length-1].Hora_fim, Validators.required),
      servicos: new FormControl(servicos, Validators.required),
      valor: new FormControl(marcacaoToEdit[0].Valor, Validators.required),
      hasPause: new FormControl(marcacaoToEdit.length>1),
      clienteIsNotRegister: new FormControl(!!marcacaoToEdit[0].Cliente_nome),
    });
    this.hasPause=marcacaoToEdit.length>1
    this.horaFinal=marcacaoToEdit[marcacaoToEdit.length-1].Hora_fim
    this.horaInicial=marcacaoToEdit[0].Hora_inicio;
    let arrayMarcacaoPause=marcacaoToEdit.filter(r=>r.Tipo_marcacao_id==1)
    arrayMarcacaoPause.forEach((r,i)=>{
      this.formAgenda.addControl('hora_ini_pausa_' + (i+1),new FormControl(r.Hora_inicio, Validators.required));
      this.formAgenda.addControl('hora_fim_pausa_' + (i+1),new FormControl(r.Hora_fim, Validators.required));
      this.pauses.push(i+1);
    })
  }
  verifyConflitoAgenda(array:Array<Marcacao>){
    let agendaDay=this.agendaListToVerify.filter(r=>r.Date==array[0].Date)
    let hourBegin=(new Date('2022-01-01 9:00')).getTime()
    let hourEnd=(new Date('2022-01-01 19:00')).getTime()
    for(let a=0;a<array.length;a++){
      let hourInicio=(new Date('2022-01-01 '+array[a].Hora_inicio)).getTime()
      let hourFim=(new Date('2022-01-01 '+array[a].Hora_fim)).getTime()
      if(hourBegin>hourInicio || hourInicio>=hourEnd ){
        this.message='Hora marcada fora do horário de funcionamento'
        return false;
      }
      let marcaErro=agendaDay.find(r=>{
        let hourInicioList=(new Date('2022-01-01 '+r.Hora_inicio)).getTime()
        let hourFimList=(new Date('2022-01-01 '+r.Hora_fim)).getTime()

        return (((hourInicio>=hourInicioList && hourFimList>hourInicio)||
               (hourInicio<hourInicioList && hourFim>hourInicioList))) &&
                (r.Tipo_marcacao_id!=1 && array[a].Tipo_marcacao_id!=1)
      })
      if(marcaErro){
        this.message='Este funcionário já possui uma marcação ou intervalo nesse horário'
        return false;
      }
    }
    return true;
  }

  changeCheckboxCliente(value) {
    this.clienteIsNotRegister=value;
    this.formAgenda.patchValue({cliente:null})
  }

  changeCheckbox(value) {
    this.hasPause = value;
    if (this.hasPause) {
      this.pauses.push(1);
      this.formAgenda.addControl(
        'hora_ini_pausa_1',
        new FormControl('', Validators.required)
      );
      this.formAgenda.addControl(
        'hora_fim_pausa_1',
        new FormControl('', Validators.required)
      );
    } else {   
      this.pauses.forEach((r) => {
        this.formAgenda.removeControl(`hora_ini_pausa_${r}`);
        this.formAgenda.removeControl(`hora_fim_pausa_${r}`);
      });
      this.pauses = new Array<number>();
    }
  }

  changeHourInit(value) {
    this.horaInicial = value;
    let time = new Date('2022-01-01 ' + value);
    let minutes_rec = 0;
    this.servicosSelect.forEach((r) => (minutes_rec += r.Tempo_recomendado));
    time.setMinutes(time.getMinutes() + minutes_rec);
    let hora = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    let min =time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    this.horaFinal =`${hora}:${min}`
    this.formAgenda.patchValue({ hora_fim: `${hora}:${min}` });
  }
  changeHourFim(value) {
    this.horaFinal = value;
  }

  changeValue(servico_ids: Array<number>) {
    if (servico_ids) {
      this.servicosSelect = this.servicos.filter((r) =>
        servico_ids.includes(r.id)
      );
      let value = 0;
      this.servicosSelect.forEach((r) => (value += r.Valor_recomendado));
      this.formAgenda.patchValue({ valor: value });
    }
  }
  addPausa(i: number) {
    i++;
    this.pauses.push(i);
    this.formAgenda.addControl(
      'hora_ini_pausa_' + i,
      new FormControl('', Validators.required)
    );
    this.formAgenda.addControl(
      'hora_fim_pausa_' + i,
      new FormControl('', Validators.required)
    );
  }
  removePausa(i: number) {
    this.pauses.pop();
    this.formAgenda.removeControl(`hora_ini_pausa_${i}`);
    this.formAgenda.removeControl(`hora_fim_pausa_${i}`);
  }
  verifyHour(){
    if ((new Date('2022-01-01 ' + this.horaInicial)).getTime()<(new Date('2022-01-01 ' + this.horaFinal)).getTime()) {
      let pausaError=null;
      if(this.pauses.length>=0){
        pausaError = this.pauses.find((r) => {
        let pausa_ini = new Date(
          '2022-01-01 ' +
          this.formAgenda.controls['hora_ini_pausa_' + r].value
        );
        let pausa_fim = new Date(
          '2022-01-01 ' +
          this.formAgenda.controls['hora_fim_pausa_' + r].value
        );
        if(pausa_fim.getTime()<=pausa_ini.getTime()){
          return true;
        }
        let pauseErrorBetween = this.pauses.find((a) => {
          if (a != r) {
            let pausa_ini_bet = new Date(
              '2022-01-01 ' +
              this.formAgenda.controls['hora_ini_pausa_' + a].value
            );
            let pausa_fim_bet = new Date(
              '2022-01-01 ' +
              this.formAgenda.controls['hora_fim_pausa_' + a].value
            );
            if((a>r && pausa_fim.getTime()>pausa_fim_bet.getTime())){
              return true;
            }
            return (
              pausa_fim.getTime() > pausa_ini_bet.getTime() &&
              pausa_ini.getTime() < pausa_fim_bet.getTime()
            );
          } else return false;
        });
        return (
          pausa_fim.getTime() < pausa_ini.getTime() ||
          new Date('2022-01-01 ' + this.horaInicial).getTime() >
          pausa_ini.getTime() ||
          new Date('2022-01-01 ' + this.horaFinal).getTime() <
          pausa_fim.getTime() ||
          pauseErrorBetween
        );
      });
      } 
      if (!pausaError) {
        this.message = null;
        return true
      } else {
        this.message = 'Conflito de horários nas pausas';
        return false
      }
    }else{
      this.message = 'Horário do início do serviço tem que ser menor do que o do fim';
      return false
    }
  }
  createMarcacao() {
    if (this.formAgenda.valid) {
      //if( (new Date(this.formAgenda.controls['date'].value+' 23:59'))>=(new Date())){
        if(this.verifyHour()){
          this.createMarcacaoArray=new Array<Marcacao>();
          let marcacaoModel=new Marcacao();
          if(this.clienteIsNotRegister){
            marcacaoModel.Cliente_nome=this.formAgenda.value.cliente
            marcacaoModel.Cliente_id=null;
          }else{
            marcacaoModel.Cliente_id=parseInt(this.formAgenda.value.cliente)
            marcacaoModel.Cliente_nome=''
          }
          marcacaoModel.Date=this.formAgenda.value.date
          marcacaoModel.Ordem_de_servico=this.isEdit?this.ordem_de_servico:this.last_ordem+1
          marcacaoModel.Valor=this.formAgenda.value.valor
          marcacaoModel.Servico_ids=this.formAgenda.value.servicos.toString()
          marcacaoModel.Usuario_id=this.userSelect.id
          marcacaoModel.Hora_inicio=this.formAgenda.value.hora_inicio
          marcacaoModel.Tipo_marcacao_id=0
          if(this.hasPause){
            marcacaoModel.Hora_fim=this.formAgenda.value.hora_ini_pausa_1
            this.createMarcacaoArray.push(marcacaoModel)
            for(let a=1;a<=this.pauses.length;a++){
              let marcacaoModelPausa=new Marcacao();
              Object.assign(marcacaoModelPausa,marcacaoModel)
              marcacaoModelPausa.Tipo_marcacao_id=1
              marcacaoModelPausa.Hora_inicio=this.formAgenda.controls['hora_ini_pausa_'+a].value
              marcacaoModelPausa.Hora_fim=this.formAgenda.controls['hora_fim_pausa_'+a].value
              this.createMarcacaoArray.push(marcacaoModelPausa)
              let marcacaoModelCont=new Marcacao()
              Object.assign(marcacaoModelCont,marcacaoModel)
              if(this.pauses.length==a){
                marcacaoModelCont.Tipo_marcacao_id=3
                marcacaoModelCont.Hora_inicio=this.formAgenda.controls['hora_fim_pausa_'+a].value
                marcacaoModelCont.Hora_fim=this.formAgenda.value.hora_fim
                this.createMarcacaoArray.push(marcacaoModelCont)
              }else{
                marcacaoModelCont.Tipo_marcacao_id=3
                marcacaoModelCont.Hora_inicio=this.formAgenda.controls['hora_fim_pausa_'+a].value
                marcacaoModelCont.Hora_fim=this.formAgenda.controls['hora_ini_pausa_'+(a+1)].value
                this.createMarcacaoArray.push(marcacaoModelCont)
              }
            }

          }else{
             marcacaoModel.Hora_fim=this.formAgenda.value.hora_fim
             this.createMarcacaoArray.push(marcacaoModel)
          }
          if(this.verifyConflitoAgenda(this.createMarcacaoArray)){
            if(this.isEdit){
              this.onEditMarcacao.emit(this.createMarcacaoArray)
            }else{
              this.onCreateMarcacao.emit(this.createMarcacaoArray)
            }
            this.closeModal()
          }
          
        }
     /*  }else{
        this.message = 'A data não pode ser menor que a data atual';
      } */
    }
  }
  closeModal() {
    this.hasPause=false;
    this.clienteIsNotRegister= false;
    this.horaInicial=null;
    this.horaFinal=null;
    this.servicosSelect = new Array<Servico>();
    this.hasPause=false;
    this.message='';
    this.pauses = new Array<number>();
    this.formAgenda.reset();
    this.onCloseModal.emit();
  }
}
