import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Recompensa } from 'src/app/Modelo/recompensa';
import { LoginService } from 'src/app/service/login.service';
import { RRecompensaService } from 'src/app/service/r-recompensa.service';
import { SidebarService } from 'src/app/service/sidebar.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-recompensa',
  templateUrl: './ver-recompensa.component.html',
  styleUrls: ['./ver-recompensa.component.css']
})
export class VerRecompensaComponent implements OnInit {
  recompensas: Recompensa[] = [];
  esParticipante: boolean = true;
  mostrarModal: boolean = false;
  mostrarModalEdicion: boolean = false;
  recompensaForm: FormGroup;
  editarRecompensaForm: FormGroup;
  imagenArchivo: File | null = null;
  imagenPreview: string | null = null;
  imageTouched: boolean = false;
  recompensaActual: Recompensa | null = null;
  sidebarExpanded$: Observable<boolean>;

  // Propiedades de paginación
  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 8;
  totalPages: number = 0;
  Math = Math;

  constructor(
    private recompensaService: RRecompensaService,
    private loginService: LoginService,
    private fb: FormBuilder,
    private sidebarService: SidebarService
  ) {
    this.sidebarExpanded$ = this.sidebarService.expanded$;
    this.recompensaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(40), Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/)]],
      descripcion: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/)]],
      categoria: ['', [Validators.required, Validators.maxLength(12), Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/)]],
      valor: [null, [Validators.required, Validators.min(1)]],
    });

    this.editarRecompensaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(40), Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/)]],
      descripcion: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/)]],
      categoria: ['', [Validators.required, Validators.maxLength(12), Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/)]],
      valor: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.cargarRecompensas();
    this.verificarRolUsuario();
  }

  cargarRecompensas(): void {
    this.recompensaService.listarRecompensa({ page: this.currentPage, size: this.pageSize }).subscribe(
      (data: any) => {
        this.recompensas = data.content;
        this.totalElements = data.totalElements;
        this.currentPage = data.number;
        this.totalPages = data.totalPages;
      },
      (error: any) => {
        console.error('Error al obtener recompensas', error);
      }
    );
  }

  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.cargarRecompensas();
    }
  }
  canjearRecompensa(nombreRecompensa: string): void {
    this.recompensaService.canjearRecompensa(nombreRecompensa).subscribe(
      response => {
        console.log(response); // Para depuración
        // Muestra un mensaje de éxito
        Swal.fire({
          title: '¡Éxito!',
          text: response.message, // Usa el mensaje de la respuesta
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      },
      error => {
        console.log(error); // Para depuración
        // Muestra un mensaje de error
        Swal.fire({
          title: 'Error',
          text: 'Error te quedaste sin puntos',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    );
  }

  eliminarRecompensa(id: number): void {
    this.recompensaService.eliminarRecompensa(id).subscribe(
      response => {
        Swal.fire('Eliminado!', 'La recompensa ha sido eliminada.', 'success');
        this.cargarRecompensas();
      },
      error => {
        if (error.status === 400 || error.status === 422) { // Ajusta los códigos de estado según tu backend
          // Muestra un mensaje específico para recompensas canjeadas
          Swal.fire('Error', 'No se puede eliminar una recompensa que ya ha sido canjeada.', 'error');
        } else {
          // Manejo de otros tipos de errores
          Swal.fire('Error', 'Ocurrió un error al intentar eliminar la recompensa.', 'error');
        }
      }
    );
  }
  confirmarEliminacion(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarRecompensa(id);
      }
    });
  }

  verificarRolUsuario(): void {
    const rol = this.loginService.getUserRole();
    this.esParticipante = rol === 'PARTICIPANTE';
  }

  editarRecompensa(recompensa: Recompensa): void {
    this.recompensaActual = recompensa;
    this.editarRecompensaForm.patchValue({
      titulo: recompensa.titulo,
      descripcion: recompensa.descripcion,
      categoria: recompensa.categoria,
      valor: recompensa.valor
    });
    this.mostrarModalEdicion = true;
  }

  cerrarModalEdicion(): void {
    this.mostrarModalEdicion = false;
    this.editarRecompensaForm.reset();
    this.recompensaActual = null;
  }

  onSubmitEditar(): void {
    if (this.editarRecompensaForm.valid && this.recompensaActual) {
      const titulo = this.editarRecompensaForm.get('titulo')!.value;
      const descripcion = this.editarRecompensaForm.get('descripcion')!.value;

      // Verificar duplicados
      const recompensaDuplicada = this.verificarDuplicado(titulo, descripcion, this.recompensaActual.id);
      if (recompensaDuplicada) {
        Swal.fire('Error', 'Ya existe otra recompensa con el mismo título o descripción.', 'error');
        return;
      }

      const recompensaActualizada = {
        ...this.recompensaActual,
        titulo: this.editarRecompensaForm.get('titulo')!.value,
        descripcion: this.editarRecompensaForm.get('descripcion')!.value,
        categoria: this.editarRecompensaForm.get('categoria')!.value,
        valor: this.editarRecompensaForm.get('valor')!.value
      };

      this.actualizarRecompensa(recompensaActualizada);
      this.cerrarModalEdicion();
    }
  }

  // Método anterior mantenido como comentario por si se necesita
  /*editarRecompensaOld(recompensa: Recompensa): void {
    Swal.fire({
      title: 'Editar Recompensa',
      html: `
      <div class="swal2-label">Título</div>
      <input id="titulo" class="swal2-input" placeholder="Título" value="${recompensa.titulo}">

      <div class="swal2-label">Descripción</div>
      <input id="descripcion" class="swal2-input" placeholder="Descripción" value="${recompensa.descripcion}">

      <div class="swal2-label">Valor</div>
      <input id="valor" type="number" class="swal2-input" placeholder="Valor" value="${recompensa.valor}">
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const titulo = (<HTMLInputElement>document.getElementById('titulo')).value;
        const descripcion = (<HTMLInputElement>document.getElementById('descripcion')).value;
        const valor = (<HTMLInputElement>document.getElementById('valor')).value;

        if (!titulo || !descripcion || !valor) {
          Swal.showValidationMessage('Todos los campos son obligatorios.');
          return false;
        }

        const soloLetrasRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/;
        if (!soloLetrasRegex.test(titulo)) {
          Swal.showValidationMessage('El título solo debe contener letras y espacios.');
          return false;
        }
        if (titulo.length > 40) {
          Swal.showValidationMessage('El título no debe exceder los 40 caracteres.');
          return false;
        }
        if (!soloLetrasRegex.test(descripcion)) {
          Swal.showValidationMessage('La descripción solo debe contener letras y espacios.');
          return false;
        }
        if (descripcion.length > 30) {
          Swal.showValidationMessage('La descripción no debe exceder los 30 caracteres.');
          return false;
        }
        if (isNaN(Number(valor)) || Number(valor) <= 0) {
          Swal.showValidationMessage('El valor debe ser un número mayor que 0.');
          return false;
        }

        // Verifica si ya existe otra recompensa con el mismo título o descripción
        const recompensaDuplicada = this.verificarDuplicado(titulo, descripcion, recompensa.id);
        if (recompensaDuplicada) {
          Swal.showValidationMessage('Ya existe otra recompensa con el mismo título o descripción.');
          return false;
        }

        return { titulo, descripcion, valor };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const recompensaActualizada = {
          ...recompensa,
          titulo: result.value.titulo,
          descripcion: result.value.descripcion,
          valor: result.value.valor
        };

        this.actualizarRecompensa(recompensaActualizada);
      }
    });
  }*/

// Función para verificar si hay recompensas duplicadas al editar
  verificarDuplicado(titulo: string, descripcion: string, id: number): boolean {
    return this.recompensas.some(
      recompensa =>
        (recompensa.titulo.toLowerCase() === titulo.toLowerCase() ||
          recompensa.descripcion.toLowerCase() === descripcion.toLowerCase()) &&
        recompensa.id !== id
    );
  }

  actualizarRecompensa(recompensaActualizada: Recompensa): void {
    console.log('Recompensa a actualizar:', recompensaActualizada);

    this.recompensaService.actualizarRecompensa(recompensaActualizada).subscribe(
      data => {
        Swal.fire('¡Actualizado!', 'La recompensa ha sido actualizada con éxito.', 'success');
        this.cargarRecompensas();
      },
      error => {
        Swal.fire('Error', 'Hubo un problema al actualizar la recompensa.', 'error');
      }
    );
  }

  // Métodos del modal
  abrirModalRegistro(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.onReset();
  }

  onFileSelected(event: Event): void {
    this.imageTouched = true;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.imagenArchivo = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(this.imagenArchivo);
    }
  }

  removeImage(): void {
    this.imagenArchivo = null;
    this.imagenPreview = null;
    this.imageTouched = false;
  }

  onSubmit(): void {
    const titulo = this.recompensaForm.value.titulo;
    const descripcion = this.recompensaForm.value.descripcion;

    // Verifica si ya existe una recompensa con el mismo título o descripción
    const recompensaDuplicada = this.verificarDuplicadoRegistro(titulo, descripcion);

    if (recompensaDuplicada) {
      Swal.fire('Error', 'Ya existe una recompensa con el mismo título o descripción.', 'error');
      return;
    }

    if (this.recompensaForm.valid && this.imagenArchivo) {
      const formData = new FormData();
      formData.append('titulo', this.recompensaForm.value.titulo);
      formData.append('descripcion', this.recompensaForm.value.descripcion);
      formData.append('categoria', this.recompensaForm.value.categoria);
      formData.append('valor', this.recompensaForm.value.valor);
      formData.append('imagenPath', this.imagenArchivo);

      this.recompensaService.registrarRecompensa(formData).subscribe(
        response => {
          Swal.fire('¡Éxito!', 'Recompensa registrada correctamente', 'success');
          this.cerrarModal();
          this.cargarRecompensas();
        },
        error => {
          console.error(error);
          Swal.fire('Error', 'La imagen excede los límites de tamaño (5mb)', 'error');
        }
      );
    } else {
      this.imageTouched = true;
      Swal.fire('Error', 'Por favor completa todos los campos y sube una imagen', 'error');
    }
  }

  verificarDuplicadoRegistro(titulo: string, descripcion: string): boolean {
    return this.recompensas.some(
      recompensa =>
        recompensa.titulo.toLowerCase() === titulo.toLowerCase() ||
        recompensa.descripcion.toLowerCase() === descripcion.toLowerCase()
    );
  }

  onReset(): void {
    this.recompensaForm.reset();
    this.imagenArchivo = null;
    this.imagenPreview = null;
    this.imageTouched = false;
  }
}
