import { ServicoComponent } from './pages/servico/servico.component';
import { UserComponent } from './pages/user/user.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';


const routes: Routes = [
  { path: '', redirectTo: 'agenda', pathMatch: 'full' },
  {path:"agenda", component:AgendaComponent},
  {path:"login", component:LoginComponent},
  {path:"user", component:UserComponent},
  {path:"servico", component:ServicoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
