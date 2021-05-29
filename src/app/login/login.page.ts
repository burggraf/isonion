import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
// import { User, Session } from '@supabase/supabase-js';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public email = '';
  public pw = '';
  constructor(public userService: UserService) { }

  ngOnInit() {
  }

  async register() {
    const result = await this.userService.register(this.email, this.pw);
  }
  async signIn() {
    const result = await this.userService.signIn(this.email, this.pw);
  }
  async signOut() {
    const { error } = await this.userService.signOut();
    if (!error) {
      location.reload();
    }
  }
  forgotPassword() {

  }
}
