import { User } from './../../models/User';
import { Router } from '@angular/router';
import { LocalStorageService } from './../../services/local-storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  user:User;
  constructor(private session:LocalStorageService,
    private router:Router) { }

  ngOnInit(): void {
    this.user=this.session.get('user')
    if(!this.user){
      this.router.navigate(['/login'])
    }
  }
  
   logOut(){
       this.session.clear();
       this.router.navigate(['/login'])
  }

}
