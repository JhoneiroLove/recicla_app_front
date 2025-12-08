import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class ResiduoService {
  constructor(private httpClient: HttpClient) { }

  // completado
  public addResiduo(residuo: any): Observable<any> {
    return this.httpClient.post(`${baserUrl}/residuo/crear-residuo`, residuo);
  }

  public getAllResiduos(pageable: any): Observable<any> {
    return this.httpClient.get(`${baserUrl}/residuo/mostrar-residuos`, { params: pageable });
  }

  public getResiduoById(id: number): Observable<any> {
    return this.httpClient.get(`${baserUrl}/residuo/${id}`);
  }

  public updateResiduo(residuo: any): Observable<any> {
    return this.httpClient.put(`${baserUrl}/residuo`, residuo);
  }

  public deleteResiduoById(id: number): Observable<any> {
    return this.httpClient.delete(`${baserUrl}/residuo/${id}`);
  }

  public listarResiduos(): Observable<any> {
    return this.httpClient.get(`${baserUrl}/residuo/listar-residuos`);
  }

  public listarResiduosPublico(): Observable<any> {
    return this.httpClient.get(`${baserUrl}/residuo/`);
  }
}
