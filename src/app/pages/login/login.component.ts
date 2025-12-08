import { Router } from '@angular/router';
import { LoginService } from './../../service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginData = {
    username: '',
    password: '',
  };

  constructor(
    private snack: MatSnackBar,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  formSubmit() {
    if (
      this.loginData.username.trim() == '' ||
      this.loginData.username.trim() == null
    ) {
      this.snack.open('El nombre de usuario es requerido !!', 'Aceptar', {
        duration: 3000,
      });
      return;
    }

    if (
      this.loginData.password.trim() == '' ||
      this.loginData.password.trim() == null
    ) {
      this.snack.open('La contraseña es requerida !!', 'Aceptar', {
        duration: 3000,
      });
      return;
    }

    // ROLES PARTICIPANTE - ADMINISTRADOR - ONG
    this.loginService.generateToken(this.loginData).subscribe(
      (data: any) => {
        this.loginService.loginUser(data.token);

        const userRole = this.loginService.getUserRole();
        if (userRole === 'ADMINISTRADOR') {
          this.router.navigate(['/admin/ver-recompensa']);
        } else if (userRole === 'PARTICIPANTE') {
          this.router.navigate(['/user/ver-historial']);
        } else if (userRole === 'ONG') {
          this.router.navigate(['/ong/validacion-ong']);
        } else {
          this.router.navigate(['/']);
        }
      },
      (error) => {
        console.log(error);
        this.snack.open(
          'Detalles inválidos , vuelva a intentar !!',
          'Aceptar',
          {
            duration: 3000,
          }
        );
      }
    );
  }
}
