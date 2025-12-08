import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/service/login.service';
import { SidebarService } from 'src/app/service/sidebar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  displayedColumns: string[] = ['field', 'value'];
  sidebarExpanded$: Observable<boolean>;

  constructor(
    public loginService: LoginService,
    private sidebarService: SidebarService
  ) {
    this.sidebarExpanded$ = this.sidebarService.expanded$;
  }

  ngOnInit(): void {
  }

  get isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  createUserData() {
    const userDetails = this.loginService.getUserDetails();
    return userDetails ? [
      { field: 'Nombre', value: userDetails.nombre },
      { field: 'Username', value: userDetails.username },
      { field: 'Telefono', value: userDetails.telefono },
      { field: 'Correo', value: userDetails.correo },
      { field: 'DNI', value: userDetails.dni },
      { field: 'Nivel', value: userDetails.nivel }
    ] : [];
  }
}
