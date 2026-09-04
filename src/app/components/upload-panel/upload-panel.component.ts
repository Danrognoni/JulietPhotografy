import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../services/shop.service';
import { PhotoCategory } from '../../models/photo.model';

@Component({
  selector: 'app-upload-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Section / Modal Container -->
    @if (shop.isUploadModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-xl bg-[#080210]/85 animate-fadeIn">
        
        <div class="relative w-full max-w-2xl bg-gradient-to-b from-[#1a0c36] to-[#120726] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80 my-8">
          
          <!-- Close Button -->
          <button
            (click)="shop.closeUploadModal()"
            aria-label="Cerrar modal"
            class="absolute top-5 right-5 p-2 rounded-full text-purple-300 hover:text-white bg-purple-900/30 hover:bg-purple-800/50 border border-purple-700/40 transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- Modal Header -->
          <div class="mb-6 text-center sm:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-purple-700/30">
              <span class="w-2 h-2 rounded-full bg-fuchsia-400"></span>
              Panel de Administración
            </div>
            <h3 class="font-display font-bold text-2xl sm:text-3xl text-white">
              Subir Nueva Fotografía
            </h3>
            <p class="text-purple-200/70 text-sm mt-1">
              Publica una obra en la galería con precio, formato y especificaciones técnicas.
            </p>
          </div>

          <!-- Drag and Drop Lilac Zone -->
          <div
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
            (click)="fileInput.click()"
            [class.border-fuchsia-400]="isDragging()"
            [class.bg-purple-900/30]="isDragging()"
            class="drag-drop-zone rounded-2xl p-6 sm:p-8 text-center cursor-pointer relative overflow-hidden transition-all duration-300 mb-6 group">
            
            <input
              #fileInput
              type="file"
              accept="image/*"
              (change)="onFileSelected($event)"
              class="hidden"/>

            @if (previewUrl()) {
              <!-- Uploaded Image Preview -->
              <div class="relative max-h-56 rounded-xl overflow-hidden shadow-lg border border-purple-400/30 mx-auto">
                <img [src]="previewUrl()" alt="Vista previa de la obra" class="w-full h-48 object-cover"/>
                <div class="absolute inset-0 bg-[#0b0416]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span class="px-3 py-1.5 rounded-lg bg-purple-900/90 text-white text-xs font-medium border border-purple-400/40">
                    Cambiar imagen
                  </span>
                </div>
              </div>
            } @else {
              <!-- Empty Drop State in Soft Lilac -->
              <div class="flex flex-col items-center justify-center space-y-3">
                <div class="w-14 h-14 rounded-2xl bg-purple-900/40 border border-purple-500/30 text-purple-300 group-hover:text-fuchsia-300 group-hover:scale-110 group-hover:border-fuchsia-400/60 transition-all flex items-center justify-center shadow-inner">
                  <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                    <path d="M12 12v9"/>
                    <path d="m16 16-4-4-4 4"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm sm:text-base font-semibold text-purple-100">
                    Arrastra tu fotografía aquí o <span class="text-fuchsia-400 underline decoration-fuchsia-400/50 underline-offset-4">haz clic para examinar</span>
                  </p>
                  <p class="text-xs text-purple-300/60 mt-1">
                    Archivos admitidos: RAW, TIFF, JPG o PNG de alta resolución (máx. 50MB)
                  </p>
                </div>
              </div>
            }
          </div>

          <!-- Quick URL helper for convenience -->
          <div class="mb-5 flex items-center gap-2">
            <input
              type="url"
              [(ngModel)]="customImageUrl"
              (ngModelChange)="onUrlInput($event)"
              placeholder="O pega directamente una URL de imagen (ej. Unsplash)..."
              class="w-full px-4 py-2 text-xs rounded-xl bg-[#120624] border border-purple-800/40 text-purple-100 placeholder-purple-400/40 focus:outline-none focus:border-fuchsia-400"/>
          </div>

          <!-- Form Fields -->
          <form (ngSubmit)="submitPhoto()" class="space-y-4">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Title -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1.5">
                  Título de la Obra *
                </label>
                <input
                  type="text"
                  required
                  [(ngModel)]="formTitle"
                  name="formTitle"
                  placeholder="Ej: Silencio en la Cumbre"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#120624] border border-purple-800/50 text-white placeholder-purple-400/40 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 text-sm"/>
              </div>

              <!-- Category Selection -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1.5">
                  Categoría *
                </label>
                <select
                  [(ngModel)]="formCategory"
                  name="formCategory"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#120624] border border-purple-800/50 text-white focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 text-sm">
                  <option value="Paisaje">Paisaje</option>
                  <option value="Producto">Producto</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Price -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1.5">
                  Precio (USD) *
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400 font-bold">$</span>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    required
                    [(ngModel)]="formPrice"
                    name="formPrice"
                    placeholder="120"
                    class="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#120624] border border-purple-800/50 text-white placeholder-purple-400/40 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 text-sm"/>
                </div>
              </div>

              <!-- Format / Dimensions -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1.5">
                  Formato / Dimensiones
                </label>
                <input
                  type="text"
                  [(ngModel)]="formDimensions"
                  name="formDimensions"
                  placeholder="Ej: 60 x 40 cm · Fine Art 310g"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#120624] border border-purple-800/50 text-white placeholder-purple-400/40 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 text-sm"/>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1.5">
                Descripción Artística
              </label>
              <textarea
                rows="2"
                [(ngModel)]="formDescription"
                name="formDescription"
                placeholder="Breve reseña sobre la luz, ubicación o concepto de la toma..."
                class="w-full px-4 py-2.5 rounded-xl bg-[#120624] border border-purple-800/50 text-white placeholder-purple-400/40 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 text-sm"></textarea>
            </div>

            <!-- Submit Button & Feedback -->
            <div class="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                (click)="shop.closeUploadModal()"
                class="px-5 py-2.5 rounded-xl text-sm font-medium text-purple-300 hover:text-white hover:bg-purple-900/30 transition-colors">
                Cancelar
              </button>

              <button
                type="submit"
                [disabled]="!isFormValid()"
                class="btn-neon-violet px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                <span>Publicar Fotografía</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    }
  `
})
export class UploadPanelComponent {
  readonly shop = inject(ShopService);

  // Form states
  readonly isDragging = signal<boolean>(false);
  readonly previewUrl = signal<string>('');
  
  formTitle = '';
  formCategory: PhotoCategory = 'Paisaje';
  formPrice = 120;
  formDimensions = '60 x 40 cm · Fine Art 310g';
  formDescription = '';
  customImageUrl = '';

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.readFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.readFile(input.files[0]);
    }
  }

  onUrlInput(url: string): void {
    if (url && url.startsWith('http')) {
      this.previewUrl.set(url);
    }
  }

  private readFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  isFormValid(): boolean {
    return this.formTitle.trim().length > 0 &&
      this.formPrice > 0 &&
      (this.previewUrl().length > 0 || this.customImageUrl.length > 0);
  }

  submitPhoto(): void {
    if (!this.isFormValid()) return;

    const finalImage = this.previewUrl() || this.customImageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85';

    this.shop.addPhoto({
      title: this.formTitle.trim(),
      category: this.formCategory,
      price: Number(this.formPrice),
      imageUrl: finalImage,
      description: this.formDescription.trim() || 'Obra artística recién incorporada al catálogo Fine Art.',
      dimensions: this.formDimensions.trim() || '60 x 40 cm · Fine Art',
      inStock: true,
      badge: 'Nuevo'
    });

    // Reset and close
    this.resetForm();
    this.shop.closeUploadModal();
  }

  private resetForm(): void {
    this.previewUrl.set('');
    this.formTitle = '';
    this.formCategory = 'Paisaje';
    this.formPrice = 120;
    this.formDimensions = '60 x 40 cm · Fine Art 310g';
    this.formDescription = '';
    this.customImageUrl = '';
  }
}
