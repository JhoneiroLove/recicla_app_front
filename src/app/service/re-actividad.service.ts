import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root',
})
export class ReActividadService {
  constructor(private httpClient: HttpClient) {}

  public registrarActividad(formData: FormData): Observable<any> {
    return this.httpClient.post(`${baserUrl}/actividad/registro`, formData);
  }

  public registrarActividadCentro(formData: FormData): Observable<any> {
    return this.httpClient.post(
      `${baserUrl}/actividad/registro-centro`,
      formData
    );
  }

  public obtenerHistorialPorUsuario(): Observable<any> {
    return this.httpClient.get(`${baserUrl}/actividad/historial`);
  }

  public obtenerEstadisticasUsuario(): Observable<any> {
    return this.httpClient.get(`${baserUrl}/actividad/estadisticas`);
  }

  // En tu servicio ReActividadService
  obtenerQR(idActividad: number): Observable<Blob> {
    return this.httpClient.get(`${baserUrl}/actividad/qr/${idActividad}`, {
      responseType: 'blob',
    });
  }
}
