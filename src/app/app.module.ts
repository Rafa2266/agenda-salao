import { RouterModule } from '@angular/router';
import {  HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { MainHeaderComponent } from './pages/main-header/main-header.component';
import { UserComponent } from './pages/user/user.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserCreateComponent } from './pages/user/user-create/user-create.component';
import { NgxSelectModule, INgxSelectOptions } from 'ngx-select-ex';
import { ServicoComponent } from './pages/servico/servico.component';
import { ServicoCreateComponent } from './pages/servico/servico-create/servico-create.component';
const CustomSelectOptions: INgxSelectOptions = { // Check the interface for more options
  optionValueField: 'id',
  optionTextField: 'Nome',
  keepSelectedItems:true
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AgendaComponent,
    MainHeaderComponent,
    UserComponent,
    UserCreateComponent,
    ServicoComponent,
    ServicoCreateComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ModalModule.forRoot(),
    NgxSelectModule.forRoot(CustomSelectOptions),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
