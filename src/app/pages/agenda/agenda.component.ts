import { Router } from '@angular/router';
import { User } from './../../models/User';
import { LocalStorageService } from './../../services/local-storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
  user:User;
  constructor(private session:LocalStorageService, private router:Router) { }

  ngOnInit(): void {
    this.user=this.session.get('user')
    if(!this.user){
      this.router.navigate(['/login'])
    }
  }

}
