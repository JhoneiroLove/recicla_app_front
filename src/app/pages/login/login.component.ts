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
  showPassword: boolean = false;

  constructor(
    private snack: MatSnackBar,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  formSubmit() {
    // Validación de campos
    if (!this.loginData.username. trim()) {
      this.snack.open('El nombre de usuario es requerido', 'Aceptar', {
        duration: 3000,
      });
      return;
    }

    if (!this.loginData. password.trim()) {
      this.snack.open('La contraseña es requerida', 'Aceptar', {
        duration: 3000,
      });
      return;
    }

    // Llamada al servicio de login
    this.loginService. generateToken(this.loginData).subscribe(
      (data: any) => {
        console. log('🔐 Respuesta del servidor:', data);

        const token = data.token || data;

        if (! token || typeof token !== 'string') {
          console.error('❌ Token inválido recibido:', token);
          this.snack.open('Error: No se recibió un token válido', 'Aceptar', {
            duration: 3000,
          });
          return;
        }

        try {
          // Guardar el token usando el servicio
          this.loginService.loginUser(token);

          // Obtener el rol del usuario
          const role = this.loginService.getUserRole();
          console.log('✅ Login exitoso - Rol:', role);

          // Verificar que se guardó correctamente
          if (! this.loginService.isLoggedIn()) {
            throw new Error('El token no se guardó correctamente');
          }

          // Navegar según el rol
          this.navigateByRole(role);

        } catch (error) {
          console. error('💥 Error al procesar el login:', error);
          this.snack.open('Error al iniciar sesión: ' + error, 'Aceptar', {
            duration: 3000,
          });
        }
      },
      (error) => {
        console.error('❌ Error en login:', error);
        this.snack.open('Credenciales inválidas, intente nuevamente', 'Aceptar', {
          duration: 3000,
        });
      }
    );
  }

  private navigateByRole(role: string) {
    const routes: { [key: string]: string } = {
      'ADMINISTRADOR': '/admin/ver-recompensa',
      'PARTICIPANTE': '/user/ver-historial',
      'ONG': '/ong/validacion-ong',
      'CENTRO_ACOPIO': '/centro/registrar-actividad'
    };

    const targetRoute = routes[role] || '/';
    console.log('📍 Navegando a:', targetRoute);

    this.router.navigate([targetRoute]). then(
      () => console.log('✅ Navegación exitosa'),
      (err) => console.error('❌ Error al navegar:', err)
    );
  }
}
