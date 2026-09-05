import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';
import { Photo, PhotoCategory } from '../../models/photo.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="fotos" class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div class="flex items-center gap-2 text-teal-700 font-semibold text-xs uppercase tracking-widest mb-2">
            <span class="w-6 h-[2px] bg-teal-500"></span>
            <span>Portafolio Fotográfico</span>
          </div>
          <h2 class="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight">
            Galería de Fotos
          </h2>
          <p class="text-slate-600 text-sm sm:text-base mt-2 max-w-xl font-normal">
            Explora una selección de mis trabajos en Foto Producto, Paisajismo y Cobertura de Eventos. Cada fotografía incluye su ficha técnica detallada.
          </p>
        </div>

        <!-- Filter Controls (Todos, Foto Producto, Paisajismo, Eventos) & Search -->
        <div class="flex flex-wrap items-center gap-3">
          
          <!-- Category Filter Tabs -->
          <div class="inline-flex p-1 rounded-2xl bg-white/90 border border-slate-200 shadow-xs backdrop-blur-md">
            <button
              (click)="setFilter('Todos')"
              class="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200"
              [ngClass]="shop.selectedCategory() === 'Todos' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'">
              Todos ({{ shop.photos().length }})
            </button>
            <button
              (click)="setFilter('Foto Producto')"
              class="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200"
              [ngClass]="shop.selectedCategory() === 'Foto Producto' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'">
              Foto Producto
            </button>
            <button
              (click)="setFilter('Paisajismo')"
              class="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200"
              [ngClass]="shop.selectedCategory() === 'Paisajismo' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'">
              Paisajismo
            </button>
            <button
              (click)="setFilter('Eventos')"
              class="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200"
              [ngClass]="shop.selectedCategory() === 'Eventos' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'">
              Eventos
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative min-w-[200px]">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar foto o equipo..."
              [ngModel]="shop.searchQuery()"
              (ngModelChange)="onSearchChange($event)"
              class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-xs transition-all"/>
          </div>

        </div>
      </div>

      <!-- Photos Grid (Responsive CSS Grid) -->
      @if (shop.filteredPhotos().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          @for (photo of shop.filteredPhotos(); track photo.id) {
            <article class="card-fresh rounded-3xl overflow-hidden group flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 relative">
              
              <!-- ADMIN ON-CARD ACTION BADGES (RENDERED ONLY IF LOGGED IN) -->
              @if (auth.isAdmin()) {
                <div class="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200">
                  <button
                    (click)="editPhotoAdmin(photo)"
                    title="Editar fotografía"
                    class="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>

                  <button
                    (click)="deletePhotoAdmin(photo.id)"
                    title="Eliminar fotografía"
                    class="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              }

              <!-- Image Container with Hover Zoom and Overlay -->
              <div class="relative aspect-[4/3] overflow-hidden bg-slate-100 cursor-pointer"
                   (click)="shop.openPreview(photo)">
                
                <img
                  [src]="photo.imageUrl"
                  [alt]="photo.title"
                  loading="lazy"
                  class="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"/>
                
                <!-- Category Badge -->
                <span class="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/95 text-slate-800 border border-slate-200/90 backdrop-blur-md shadow-xs">
                  {{ photo.category }}
                </span>

                <!-- Hover Overlay with Detailed Exif / Technical Sheet -->
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                  
                  <div class="flex justify-end">
                    <button
                      (click)="$event.stopPropagation(); shop.openPreview(photo)"
                      title="Ver fotografía en alta resolución"
                      class="p-2 rounded-full bg-white/20 text-white hover:bg-white hover:text-slate-900 backdrop-blur-md transition-colors">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Hover Technical Sheet info -->
                  <div class="text-[11px] text-teal-100 bg-slate-900/80 p-3 rounded-xl backdrop-blur-md border border-teal-400/20 space-y-1">
                    <div class="font-semibold text-white flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                      <span>Ficha Técnica:</span>
                    </div>
                    <p class="text-teal-200/90 font-mono text-[10.5px]">
                      {{ photo.technicalSheet }}
                    </p>
                  </div>
                </div>

              </div>

              <!-- Card Content: Title, Mandatory Ficha Técnica, Price & CTA -->
              <div class="p-6 flex flex-col flex-grow justify-between bg-white space-y-4">
                
                <div>
                  <div class="flex items-center justify-between gap-2 mb-1.5">
                    <span class="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">
                      {{ photo.category }}
                    </span>
                    <span class="text-[11px] text-slate-500 font-normal">
                      {{ photo.dimensions }}
                    </span>
                  </div>

                  <!-- Photo Title -->
                  <h3 
                    (click)="shop.openPreview(photo)"
                    class="font-display font-bold text-lg sm:text-xl text-slate-900 group-hover:text-teal-700 transition-colors cursor-pointer mt-1 line-clamp-1">
                    {{ photo.title }}
                  </h3>

                  <!-- MANDATORY FICHA TÉCNICA VISIBLE ON CARD -->
                  <div class="mt-3 p-2.5 rounded-xl badge-tech-sheet flex items-start gap-2">
                    <svg class="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <div class="text-[11.5px] leading-tight">
                      <span class="font-bold block text-teal-900 mb-0.5">Ficha Técnica:</span>
                      <span class="text-teal-800 font-mono text-[11px]">{{ photo.technicalSheet }}</span>
                    </div>
                  </div>

                  <!-- Brief description -->
                  <p class="text-slate-600 text-xs sm:text-sm mt-2.5 line-clamp-2 font-normal leading-relaxed">
                    {{ photo.description }}
                  </p>
                </div>

                <!-- Price & Purchase / Acquisition CTA -->
                <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span class="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Copia Fine Art</span>
                    <div class="text-xl font-bold font-display text-slate-900">
                      \${{ photo.price }} <span class="text-xs text-teal-700 font-normal">USD</span>
                    </div>
                  </div>

                  <!-- Button with Visual Feedback -->
                  <button
                    (click)="handleAddToCart(photo)"
                    [disabled]="addedPhotoId() === photo.id"
                    class="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all duration-300"
                    [ngClass]="addedPhotoId() === photo.id 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'btn-fresh-gradient'">
                    
                    @if (addedPhotoId() === photo.id) {
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>¡Añadido!</span>
                    } @else {
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                        <path d="M3 6h18"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                      <span>Añadir al Carrito</span>
                    }
                  </button>
                </div>

              </div>

            </article>
          }
        </div>
      } @else {
        <!-- Empty State -->
        <div class="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <h3 class="font-display text-xl font-bold text-slate-800 mb-2">No se encontraron fotos</h3>
          <p class="text-slate-600 text-sm max-w-md mx-auto mb-6">
            No hay obras que coincidan con "{{ shop.searchQuery() }}" en la categoría seleccionada.
          </p>
          <button
            (click)="shop.setCategory('Todos'); shop.setSearchQuery('')"
            class="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium transition-colors">
            Restablecer Filtros
          </button>
        </div>
      }

    </section>
  `
})
export class GalleryComponent {
  readonly shop = inject(ShopService);
  readonly auth = inject(AuthService);
  readonly addedPhotoId = signal<string | null>(null);

  setFilter(category: PhotoCategory | 'Todos'): void {
    this.shop.setCategory(category);
  }

  onSearchChange(query: string): void {
    this.shop.setSearchQuery(query);
  }

  handleAddToCart(photo: Photo): void {
    this.shop.addToCart(photo);
    this.addedPhotoId.set(photo.id);

    setTimeout(() => {
      if (this.addedPhotoId() === photo.id) {
        this.addedPhotoId.set(null);
      }
    }, 1500);
  }

  editPhotoAdmin(photo: Photo): void {
    this.shop.startEditingPhoto(photo);
  }

  deletePhotoAdmin(id: string): void {
    if (confirm('¿Eliminar esta fotografía permanentemente del catálogo?')) {
      this.shop.deletePhoto(id)
        .pipe(
          catchError((err) => {
            const cleanMsg = this.shop.getCleanErrorMessage(err, 'eliminar la fotografía del catálogo');
            console.error('[GalleryComponent] Error al eliminar fotografía:', cleanMsg, err);
            this.shop.showAlert('error', cleanMsg);
            if (typeof window !== 'undefined') {
              alert(cleanMsg);
            }
            return throwError(() => err);
          })
        )
        .subscribe({
          next: () => {
            this.shop.showAlert('success', 'Fotografía eliminada correctamente.');
          }
        });
    }
  }
}
