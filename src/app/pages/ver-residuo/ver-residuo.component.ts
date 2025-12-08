import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResiduoService } from 'src/app/service/residuo.service';
import { SidebarService } from 'src/app/service/sidebar.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-residuo',
  templateUrl: './ver-residuo.component.html',
  styleUrls: ['./ver-residuo.component.css']
})
export class VerResiduoComponent implements OnInit {
  residuos: any[] = [];
  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 8; // Variable para almacenar el tamaño de página seleccionado
  totalPages: number = 0;
  Math = Math;
  sidebarExpanded$: Observable<boolean>;
  mostrarModalRegistro: boolean = false;
  mostrarModalEdicion: boolean = false;
  residuoForm!: FormGroup;
  editarResiduoForm!: FormGroup;
  residuoActual: any = null;

  constructor(
    private residuoService: ResiduoService,
    private sidebarService: SidebarService,
    private router: Router
  ) {
    this.sidebarExpanded$ = this.sidebarService.expanded$;
  }

  ngOnInit() {
    this.cargarResiduos();
    this.inicializarFormulario();
    this.inicializarFormularioEditar();
  }

  inicializarFormulario(): void {
    this.residuoForm = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/),
        Validators.maxLength(25)
      ]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/),
        Validators.maxLength(30)
      ]),
      tipo: new FormControl('', [Validators.required]),
      puntos: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.min(1)
      ])
    });
  }

  inicializarFormularioEditar(): void {
    this.editarResiduoForm = new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/),
        Validators.maxLength(25)
      ]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/),
        Validators.maxLength(30)
      ]),
      tipo: new FormControl('', [Validators.required]),
      puntos: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.min(1)
      ])
    });
  }

  cargarResiduos(event?: PageEvent) {
    // Actualiza currentPage y pageSize en función del evento, si existe
    this.currentPage = event ? event.pageIndex : this.currentPage;
    this.pageSize = event ? event.pageSize : this.pageSize;

    this.residuoService.getAllResiduos({ page: this.currentPage, size: this.pageSize }).subscribe(data => {
      this.residuos = data.content;
      this.totalElements = data.totalElements;
      this.currentPage = data.number;
      this.totalPages = data.totalPages;
    });
  }

  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.cargarResiduos();
    }
  }

  abrirModalRegistro(): void {
    this.mostrarModalRegistro = true;
  }

  cerrarModalRegistro(): void {
    this.mostrarModalRegistro = false;
    this.residuoForm.reset();
  }

  submitFormRegistro(): void {
    if (this.residuoForm.valid) {
      const nuevoResiduo = this.residuoForm.value;

      // Verificar duplicados
      const nombreDuplicado = this.residuos.some(
        (residuo) => residuo.nombre.toLowerCase() === nuevoResiduo.nombre.toLowerCase()
      );
      const descripcionDuplicada = this.residuos.some(
        (residuo) => residuo.descripcion.toLowerCase() === nuevoResiduo.descripcion.toLowerCase()
      );

      if (nombreDuplicado) {
        Swal.fire('Error', 'Ya existe un residuo con el mismo nombre.', 'error');
        return;
      }
      if (descripcionDuplicada) {
        Swal.fire('Error', 'Ya existe un residuo con la misma descripción.', 'error');
        return;
      }

      // Registrar residuo
      this.residuoService.addResiduo(nuevoResiduo).subscribe(
        response => {
          Swal.fire('¡Éxito!', 'El residuo ha sido registrado exitosamente.', 'success');
          this.cerrarModalRegistro();
          this.cargarResiduos();
        },
        error => {
          Swal.fire('Error', 'Ha ocurrido un error al registrar el residuo.', 'error');
        }
      );
    } else {
      Swal.fire('Datos incompletos', 'Por favor, completa todos los campos del formulario.', 'warning');
    }
  }

  eliminarResiduo(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.residuoService.deleteResiduoById(id).subscribe(() => {
          Swal.fire(
            '¡Eliminado!',
            'El residuo ha sido eliminado.',
            'success'
          );
          this.cargarResiduos(); // Recargar los residuos
        }, error => {
          Swal.fire(
            'Error',
            'No se puede eliminar este residuo porque está siendo utilizado por otro usuario.',
            'error'
          );
        });
      }
    });
  }

  actualizarResiduo(residuo: any) {
    this.residuoActual = residuo;
    this.editarResiduoForm.patchValue({
      id: residuo.id,
      nombre: residuo.nombre,
      descripcion: residuo.descripcion,
      tipo: residuo.tipo,
      puntos: residuo.puntos
    });
    this.mostrarModalEdicion = true;
  }

  cerrarModalEdicion(): void {
    this.mostrarModalEdicion = false;
    this.editarResiduoForm.reset();
    this.residuoActual = null;
  }

  submitFormEditar(): void {
    if (this.editarResiduoForm.valid) {
      const residuoActualizado = this.editarResiduoForm.value;
      const { nombre, descripcion } = residuoActualizado;

      const { nombreDuplicado, descripcionDuplicada } = this.validarDuplicados(nombre, descripcion, residuoActualizado.id);

      if (nombreDuplicado) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ya existe un residuo con el mismo nombre.'
        });
      } else if (descripcionDuplicada) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ya existe un residuo con la misma descripción.'
        });
      } else {
        this.residuoService.updateResiduo(residuoActualizado).subscribe(
          response => {
            Swal.fire({
              icon: 'success',
              title: 'Residuo Actualizado',
              text: 'El residuo ha sido actualizado correctamente.'
            });
            this.cargarResiduos();
            this.cerrarModalEdicion();
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al actualizar el residuo.'
            });
          }
        );
      }
    }
  }



  validarDuplicados(nombre: string, descripcion: string, id: number): { nombreDuplicado: boolean; descripcionDuplicada: boolean } {
    const nombreDuplicado = this.residuos.some(
      (residuo) => residuo.nombre.toLowerCase() === nombre.toLowerCase() && residuo.id !== id
    );

    const descripcionDuplicada = this.residuos.some(
      (residuo) => residuo.descripcion.toLowerCase() === descripcion.toLowerCase() && residuo.id !== id
    );

    return { nombreDuplicado, descripcionDuplicada };
  }
}
