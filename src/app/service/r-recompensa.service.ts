import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importa map desde 'rxjs/operators'
import baserUrl from './helper';
import { Recompensa } from '../Modelo/recompensa';

@Injectable({
  providedIn: 'root'
})
export class RRecompensaService {
  constructor(private httpClient: HttpClient) { }

  public registrarRecompensa(formData: FormData): Observable<any> {
    return this.httpClient.post(`${baserUrl}/recompensa/crear`, formData);
  }


  public listarRecompensa(pageable?: any): Observable<any> {
    if (pageable) {
      return this.httpClient.get<any>(`${baserUrl}/recompensa/catalogo`, { params: pageable });
    }
    return this.httpClient.get<any>(`${baserUrl}/recompensa/catalogo`);
  }
  canjearRecompensa(nombreRecompensa: string): Observable<any> {
    return this.httpClient.post(`${baserUrl}/canje/canjear`, null, {
      params: { nombreRecompensa }
    });
  }
  eliminarRecompensa(id: number): Observable<any> {
    return this.httpClient.delete(`${baserUrl}/recompensa/${id}`);
  }
  actualizarRecompensa(recompensa: Recompensa): Observable<any> {
    return this.httpClient.put(`${baserUrl}/recompensa/editar/${recompensa.id}`, recompensa);
  }



}

