import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import baserUrl from './helper';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loginStatusSubjec = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  // Generar el token
  public generateToken(loginData: any) {
    return this.http.post(`${baserUrl}/usuario/login`, loginData);
  }

  // Guardar token y actualizar sesión
  public loginUser(token: string): void {
    console.log('🔑 Guardando token.. .');

    if (!token) {
      throw new Error('Token inválido o vacío');
    }

    try {
      // Decodificar el token para extraer información
      const decodedToken: any = jwtDecode(token);
      console.log('🔓 Token decodificado:', decodedToken);

      // Limpiar localStorage anterior (solo las keys relevantes)
      localStorage.removeItem('token');
      localStorage. removeItem('role');
      localStorage.removeItem('user');

      // Guardar el nuevo token
      localStorage.setItem('token', token);
      localStorage. setItem('role', decodedToken.role);

      // Verificar que se guardó
      const savedToken = localStorage.getItem('token');
      const savedRole = localStorage.getItem('role');

      console.log('✅ Guardado exitoso');
      console.log('  - Token length:', savedToken?. length);
      console.log('  - Role:', savedRole);

      if (!savedToken || !savedRole) {
        throw new Error('Fallo al guardar en localStorage');
      }

      // Notificar cambio de estado
      this.loginStatusSubjec.next(true);

    } catch (error) {
      console.error('❌ Error en loginUser:', error);
      throw error;
    }
  }

  // Verificar si hay sesión activa
  public isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return ! !(token && token.length > 0);
  }

  // Cerrar sesión
  public logout(): boolean {
    localStorage. removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    this.loginStatusSubjec.next(false);
    return true;
  }

  // Obtener token
  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtener rol del usuario
  public getUserRole(): string {
    const role = localStorage.getItem('role');
    if (role) {
      return role;
    }

    // Fallback: decodificar desde el token si no está en localStorage
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken. role || '';
      } catch (error) {
        console.error('Error al decodificar token:', error);
      }
    }
    return '';
  }

  // Obtener detalles del usuario desde el token
  public getUserDetails(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  // Obtener nombre de usuario
  public getUserName(): string {
    const userDetails = this.getUserDetails();
    return userDetails?. username || '';
  }

  // Obtener ID de usuario
  public getUserId(): number {
    const userDetails = this.getUserDetails();
    return userDetails?. userId || 0;
  }

  // Métodos legacy (mantener compatibilidad)
  public setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUser(): any {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
}
