import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: string;  
  roles: string[];

  constructor() { }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.usuario = decodedToken.user_name;
    this.roles = decodedToken.authorities;
  }

}
