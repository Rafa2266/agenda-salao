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
  @Input() servicos: Array<Servico>;
  @Input() clientes: Array<Cliente>;
  @Input() ordem_de_servico: number;
  @Output() onCreateMarcacao = new EventEmitter<Array<Marcacao>>();
  horaInicial: String;
  horaFinal: String;
  servicosSelect = new Array<Servico>();
  hasPause: boolean;
  createMarcacaoArray=new Array<Marcacao>();
  formAgenda: FormGroup;
  message: String;
  pauses = new Array<number>();
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.setFormToCreate();
  }

  setFormToCreate() {
    this.formAgenda = this.formBuilder.group({
      cliente: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      hora_inicio: new FormControl(null, Validators.required),
      hora_fim: new FormControl(null, Validators.required),
      servicos: new FormControl(null, Validators.required),
      valor: new FormControl(null, Validators.required),
      hasPause: new FormControl(false),
    });
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
      if( (new Date(this.formAgenda.controls['date'].value))>=(new Date())){
        if(this.verifyHour()){
          this.createMarcacaoArray=new Array<Marcacao>();
          let marcacaoModel=new Marcacao();
          marcacaoModel.Cliente_id=parseInt(this.formAgenda.value.cliente)
          marcacaoModel.Cliente_nome=''
          marcacaoModel.Date=this.formAgenda.value.date
          marcacaoModel.Ordem_de_servico=this.last_ordem+1
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
          this.onCreateMarcacao.emit(this.createMarcacaoArray)
          this.closeModal()
        }
      }else{
        this.message = 'A data não pode ser menor que a data atual';
      }
    }
  }
  editMarcacao() { }
  closeModal() {
    this.hasPause=false;
    this.horaInicial=null;
    this.horaFinal=null;
    this.servicosSelect = new Array<Servico>();
    this.hasPause=false;
    this.pauses = new Array<number>();
    this.formAgenda.reset();
    this.onCloseModal.emit();
  }
}
