import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baserUrl from './helper';

// DTOs
export interface ActividadPropuesta {
  actividadId: number;
  usuarioWallet: string;
  pesoKg: number;
  tipoMaterial: string;
  evidenciaIPFS: string;
  tokensCalculados: number;
  aprobaciones: number;
  ejecutada: boolean;
  rechazada: boolean;
  transactionHash?: string;
  blockNumber?: number;
}

export interface AprobarRequest {
  validadorWallet: string;
  validadorPrivateKey: string;
}

export interface RechazarRequest {
  validadorWallet: string;
  validadorPrivateKey: string;
  razon: string;
}

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  constructor(private http: HttpClient) {}

  // GET /blockchain/actividades/pendientes - Lista propuestas pendientes
  getPropuestasPendientes(): Observable<ActividadPropuesta[]> {
    return this.http.get<ActividadPropuesta[]>(
      `${baserUrl}/blockchain/actividades/pendientes`
    );
  }

  // GET /blockchain/actividades/{id} - Obtener detalles de actividad
  getActividad(actividadId: number): Observable<ActividadPropuesta> {
    return this.http.get<ActividadPropuesta>(
      `${baserUrl}/blockchain/actividades/${actividadId}`
    );
  }

  // POST /blockchain/actividades/{id}/aprobar - Aprobar actividad
  aprobarActividad(
    actividadId: number,
    request: AprobarRequest
  ): Observable<any> {
    return this.http.post(
      `${baserUrl}/blockchain/actividades/${actividadId}/aprobar`,
      request
    );
  }

  // POST /blockchain/actividades/{id}/rechazar - Rechazar actividad
  rechazarActividad(
    actividadId: number,
    request: RechazarRequest
  ): Observable<any> {
    return this.http.post(
      `${baserUrl}/blockchain/actividades/${actividadId}/rechazar`,
      request
    );
  }

  // GET /blockchain/balance - Obtener balance de usuario
  getBalance(walletAddress: string): Observable<{ balance: number }> {
    return this.http.get<{ balance: number }>(
      `${baserUrl}/blockchain/balance`,
      {
        params: { walletAddress },
      }
    );
  }

  // Construir URL pública de IPFS
  getIPFSUrl(ipfsHash: string): string {
    if (!ipfsHash || ipfsHash === 'QmPendiente') {
      return '';
    }
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  }

  // Validar hash IPFS
  isValidIPFSHash(ipfsHash: string): boolean {
    if (!ipfsHash) return false;
    // CIDv0: Qm + 44 caracteres base58
    // CIDv1: b + caracteres base32
    const cidV0Pattern = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
    const cidV1Pattern = /^b[a-z2-7]{58}$/;
    return cidV0Pattern.test(ipfsHash) || cidV1Pattern.test(ipfsHash);
  }
}
