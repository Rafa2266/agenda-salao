import { LocalStorageService } from './../../services/local-storage.service';
import { User } from './../../models/User';
import { UserLogin } from 'src/app/models/User';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/UserService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private session:LocalStorageService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.setFormToLogin();
    let user:User=this.session.get('user')
    if(user){
      this.router.navigate(['/agenda'])
    }
  }
  setFormToLogin() {
    this.formLogin = this.formBuilder.group({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }
  loginCheck() {
    if (this.formLogin.valid) {
      let userLogin = new UserLogin();
      userLogin.Email = this.formLogin.getRawValue().email;
      userLogin.password = this.formLogin.getRawValue().password;
      this.userService.checkLogin(userLogin).subscribe(
        (response: User) => {
          this.session.set('user',response,1000*60*60*8);
          this.router.navigate(['/agenda'])
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
