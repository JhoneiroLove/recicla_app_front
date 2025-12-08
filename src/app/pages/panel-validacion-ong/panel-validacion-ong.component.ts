import { Component, OnInit } from '@angular/core';
import {
  BlockchainService,
  ActividadPropuesta,
} from '../../service/blockchain.service';
import { SidebarService } from '../../service/sidebar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-panel-validacion-ong',
  templateUrl: './panel-validacion-ong.component.html',
  styleUrls: ['./panel-validacion-ong.component.css'],
})
export class PanelValidacionOngComponent implements OnInit {
  propuestasPendientes: ActividadPropuesta[] = [];
  propuestasPaginadas: ActividadPropuesta[] = [];
  cargando: boolean = false;
  mostrarFormulario: boolean = false;
  sidebarExpanded$: any;

  // Paginación
  currentPage: number = 0;
  pageSize: number = 6;
  totalPages: number = 0;
  Math = Math;

  // Datos del validador
  walletAddress: string = '';
  privateKey: string = '';
  actividadSeleccionada: ActividadPropuesta | null = null;
  accionSeleccionada: 'aprobar' | 'rechazar' | null = null;
  razonRechazo: string = '';

  // Traducción de materiales
  materialesMap: { [key: string]: string } = {
    plastico: 'Plástico',
    papel: 'Papel',
    vidrio: 'Vidrio',
    metal: 'Metal',
    carton: 'Cartón',
    organico: 'Orgánico',
  };

  constructor(
    private blockchainService: BlockchainService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.sidebarExpanded$ = this.sidebarService.expanded$;
    this.cargarPropuestas();
  }

  cargarPropuestas(): void {
    this.cargando = true;
    this.blockchainService.getPropuestasPendientes().subscribe({
      next: (propuestas) => {
        this.propuestasPendientes = propuestas;
        this.totalPages = Math.ceil(propuestas.length / this.pageSize);
        this.actualizarPagina();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando propuestas:', error);
        Swal.fire(
          'Error',
          'No se pudieron cargar las propuestas pendientes',
          'error'
        );
        this.cargando = false;
      },
    });
  }

  actualizarPagina(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.propuestasPaginadas = this.propuestasPendientes.slice(start, end);
  }

  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.actualizarPagina();
    }
  }

  getNombreMaterial(tipo: string): string {
    return this.materialesMap[tipo.toLowerCase()] || tipo;
  }

  getIPFSUrl(ipfsHash: string): string {
    return this.blockchainService.getIPFSUrl(ipfsHash);
  }

  isValidIPFS(ipfsHash: string): boolean {
    return this.blockchainService.isValidIPFSHash(ipfsHash);
  }

  abrirFormularioAprobar(propuesta: ActividadPropuesta): void {
    this.actividadSeleccionada = propuesta;
    this.accionSeleccionada = 'aprobar';
    this.mostrarFormulario = true;
    this.razonRechazo = '';
  }

  abrirFormularioRechazar(propuesta: ActividadPropuesta): void {
    this.actividadSeleccionada = propuesta;
    this.accionSeleccionada = 'rechazar';
    this.mostrarFormulario = true;
    this.razonRechazo = '';
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.actividadSeleccionada = null;
    this.accionSeleccionada = null;
    this.walletAddress = '';
    this.privateKey = '';
    this.razonRechazo = '';
  }

  ejecutarAccion(): void {
    if (!this.walletAddress || !this.privateKey) {
      Swal.fire('Error', 'Debes ingresar tu wallet y clave privada', 'warning');
      return;
    }

    if (!this.actividadSeleccionada) {
      return;
    }

    if (this.accionSeleccionada === 'aprobar') {
      this.aprobarActividad();
    } else if (this.accionSeleccionada === 'rechazar') {
      if (!this.razonRechazo.trim()) {
        Swal.fire(
          'Error',
          'Debes proporcionar una razón para el rechazo',
          'warning'
        );
        return;
      }
      this.rechazarActividad();
    }
  }

  aprobarActividad(): void {
    if (!this.actividadSeleccionada) return;

    Swal.fire({
      title: 'Aprobando actividad...',
      text: 'Firmando transacción en blockchain',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const request = {
      validadorWallet: this.walletAddress,
      validadorPrivateKey: this.privateKey,
    };

    this.blockchainService
      .aprobarActividad(this.actividadSeleccionada.actividadId, request)
      .subscribe({
        next: (response) => {
          Swal.fire('¡Aprobado!', 'Actividad aprobada exitosamente', 'success');
          this.cerrarFormulario();
          this.cargarPropuestas();
        },
        error: (error) => {
          console.error('Error aprobando actividad:', error);
          Swal.fire(
            'Error',
            error.error?.message || 'Error al aprobar actividad',
            'error'
          );
        },
      });
  }

  rechazarActividad(): void {
    if (!this.actividadSeleccionada) return;

    Swal.fire({
      title: 'Rechazando actividad...',
      text: 'Firmando transacción en blockchain',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const request = {
      validadorWallet: this.walletAddress,
      validadorPrivateKey: this.privateKey,
      razon: this.razonRechazo,
    };

    this.blockchainService
      .rechazarActividad(this.actividadSeleccionada.actividadId, request)
      .subscribe({
        next: (response) => {
          Swal.fire('Rechazado', 'Actividad rechazada exitosamente', 'success');
          this.cerrarFormulario();
          this.cargarPropuestas();
        },
        error: (error) => {
          console.error('Error rechazando actividad:', error);
          Swal.fire(
            'Error',
            error.error?.message || 'Error al rechazar actividad',
            'error'
          );
        },
      });
  }

  verEvidenciaCompleta(ipfsHash: string): void {
    const url = this.getIPFSUrl(ipfsHash);
    if (url) {
      window.open(url, '_blank');
    }
  }
}
