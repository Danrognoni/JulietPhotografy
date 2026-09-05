import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';
import { Photo, PhotoCategory, AlbumFolder } from '../../models/photo.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- SECTION 1: ÁLBUMES & CARPETAS (REVEL EDITORIAL COLLECTIONS) -->
    <section id="albumes" class="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div class="inline-flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-[0.25em] mb-2">
            <span class="w-5 h-[1px] bg-emerald-400"></span>
            <span>Carpetas & Colecciones</span>
          </div>
          <h2 class="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white font-light tracking-tight">
            Álbumes Temáticos
          </h2>
          <p class="text-slate-300 text-sm sm:text-base mt-2 max-w-xl font-sans font-normal">
            Explora las diferentes carpetas de trabajo. Cada colección agrupa fotografías reales tomadas en exteriores, salones y estudio.
          </p>
        </div>

        <!-- Quick Reset to All -->
        @if (shop.selectedCategory() !== 'Todos') {
          <button
            type="button"
            (click)="selectAlbum('Todos')"
            class="px-4 py-2 rounded-full bg-emerald-950/70 border border-emerald-400/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-900 transition-all flex items-center gap-2 self-start md:self-auto">
            <span>Ver Todas las Carpetas</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        }
      </div>

      <!-- Albums Grid (Revel Editorial Folders) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        @for (folder of shop.albumFolders(); track folder.id) {
          <article 
            (click)="selectAlbum(folder.category)"
            class="album-card-editorial cursor-pointer group flex flex-col justify-between h-[380px] sm:h-[420px]"
            [ngClass]="shop.selectedCategory() === folder.category ? 'ring-2 ring-emerald-400 border-emerald-400 shadow-emerald-500/20' : ''">
            
            @if (folder.count > 0 && folder.coverImage) {
              <!-- Cover Photo with Zoom -->
              <div class="absolute inset-0 overflow-hidden">
                <img
                  [src]="folder.coverImage"
                  [alt]="folder.name"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"/>
                <div class="absolute inset-0 bg-gradient-to-t from-[#090514] via-[#090514]/40 to-transparent"></div>
              </div>
            } @else {
              <!-- Elegant Sober Empty State (Minimalist Fine Art Placeholder) -->
              <div class="absolute inset-0 bg-gradient-to-br from-[#140c26] via-[#100820] to-[#0a0515] flex flex-col items-center justify-center p-6 text-center">
                <div class="w-16 h-16 rounded-2xl border border-violet-400/20 bg-[#190e32]/60 flex items-center justify-center text-violet-300/40 group-hover:border-emerald-400/40 group-hover:text-emerald-300/70 transition-all duration-300 mb-3 shadow-inner">
                  <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
                <span class="text-[11px] font-mono tracking-widest text-slate-400/60 uppercase">Colección en Preparación</span>
              </div>
            }

            <!-- Top Pill: Photo Counter -->
            <div class="relative z-10 p-5 flex items-center justify-between">
              <span class="px-3 py-1 rounded-full bg-[#120728]/85 border border-violet-500/30 text-emerald-300 text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-md">
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="folder.count > 0 ? 'bg-emerald-400' : 'bg-slate-500'"></span>
                <span>{{ folder.count }} {{ folder.count === 1 ? 'fotografía' : 'fotografías' }}</span>
              </span>

              @if (shop.selectedCategory() === folder.category) {
                <span class="px-2.5 py-1 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                  Activo
                </span>
              }
            </div>

            <!-- Bottom Content: Title & Description -->
            <div class="relative z-10 p-6 space-y-2 text-left bg-gradient-to-t from-[#090514] via-[#090514]/80 to-transparent">
              <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300 block">
                Carpeta de Cobertura
              </span>
              <h3 class="font-editorial text-2xl sm:text-3xl font-normal text-white group-hover:text-emerald-200 transition-colors drop-shadow-md">
                {{ folder.name }}
              </h3>
              <p class="text-xs text-slate-300/80 font-sans line-clamp-2">
                {{ folder.description }}
              </p>

              <div class="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-300 group-hover:translate-x-1 transition-transform">
                <span>{{ folder.count > 0 ? 'Ver fotografías del álbum' : 'Explorar carpeta' }}</span>
                <span>→</span>
              </div>
            </div>

          </article>
        }
      </div>

    </section>


    <!-- SECTION 2: PORTAFOLIO DETALLADO (FILTROS, FICHA TÉCNICA & SHOP) -->
    <section id="galeria" class="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      
      <!-- Filter Bar & Search -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 border-b border-violet-500/20 pb-8">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-300 block mb-1">
            Catálogo & Galería de Obras
          </span>
          <h3 class="font-editorial text-3xl sm:text-4xl text-white font-light">
            {{ shop.selectedCategory() === 'Todos' ? 'Todas las Fotografías' : 'Carpeta: ' + shop.selectedCategory() }}
            <span class="text-xs sm:text-sm font-sans text-violet-300/80 ml-2 font-normal">
              ({{ shop.filteredPhotos().length }} obras)
            </span>
          </h3>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          
          <!-- Category Filter Tabs -->
          <div class="inline-flex p-1 rounded-2xl bg-[#140b2e]/90 border border-violet-500/25 shadow-inner backdrop-blur-xl overflow-x-auto max-w-full">
            <button
              type="button"
              (click)="setFilter('Todos')"
              class="px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap"
              [ngClass]="shop.selectedCategory() === 'Todos' ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/25' : 'text-slate-300 hover:text-white hover:bg-violet-600/20'">
              Todos ({{ shop.photos().length }})
            </button>
            <button
              type="button"
              (click)="setFilter('Casamientos')"
              class="px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap"
              [ngClass]="shop.selectedCategory() === 'Casamientos' ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/25' : 'text-slate-300 hover:text-white hover:bg-violet-600/20'">
              Casamientos
            </button>
            <button
              type="button"
              (click)="setFilter('Cumpleaños XV')"
              class="px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap"
              [ngClass]="shop.selectedCategory() === 'Cumpleaños XV' ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/25' : 'text-slate-300 hover:text-white hover:bg-violet-600/20'">
              Cumpleaños XV
            </button>
            <button
              type="button"
              (click)="setFilter('Eventos')"
              class="px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap"
              [ngClass]="shop.selectedCategory() === 'Eventos' ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/25' : 'text-slate-300 hover:text-white hover:bg-violet-600/20'">
              Eventos
            </button>
            <button
              type="button"
              (click)="setFilter('Paisajismo')"
              class="px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap"
              [ngClass]="shop.selectedCategory() === 'Paisajismo' ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/25' : 'text-slate-300 hover:text-white hover:bg-violet-600/20'">
              Paisajismo
            </button>
            <button
              type="button"
              (click)="setFilter('Foto Producto')"
              class="px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap"
              [ngClass]="shop.selectedCategory() === 'Foto Producto' ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/25' : 'text-slate-300 hover:text-white hover:bg-violet-600/20'">
              Foto Producto
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative min-w-[200px] flex-grow sm:flex-grow-0">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar por título, cámara, lente..."
              [ngModel]="shop.searchQuery()"
              (ngModelChange)="onSearchChange($event)"
              class="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#140b2e]/90 border border-violet-500/30 text-white placeholder-violet-300/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 shadow-xs transition-all"/>
          </div>

        </div>
      </div>

      <!-- Photos Grid (Responsive Editorial Grid) -->
      @if (shop.filteredPhotos().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          @for (photo of shop.filteredPhotos(); track photo.id) {
            <article class="card-editorial rounded-3xl overflow-hidden group flex flex-col justify-between border border-violet-500/15 bg-[#130b24] shadow-lg hover:shadow-2xl transition-all duration-300 relative">
              
              <!-- ADMIN ON-CARD ACTION BADGES (RENDERED ONLY IF LOGGED IN) -->
              @if (auth.isAdmin()) {
                <div class="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-[#120728]/95 p-1 rounded-xl shadow-lg border border-emerald-500/40">
                  <button
                    type="button"
                    (click)="editPhotoAdmin(photo)"
                    title="Editar fotografía"
                    class="p-1.5 rounded-lg text-emerald-300 hover:bg-emerald-950/60 hover:text-white transition-colors">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>

                  <button
                    type="button"
                    (click)="deletePhotoAdmin(photo.id)"
                    title="Eliminar fotografía"
                    class="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 transition-colors">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              }

              <!-- Image Container with Quick Lightbox View Click -->
              <div 
                (click)="shop.openPreview(photo)"
                class="relative h-64 overflow-hidden bg-[#0d071e] cursor-pointer">
                
                <img
                  [src]="photo.imageUrl"
                  [alt]="photo.title"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"/>
                
                <!-- Category Badge -->
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border shadow-md backdrop-blur-md pill-mint">
                  {{ photo.category }}
                </span>

                @if (photo.badge) {
                  <span class="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#100624]/90 border border-violet-500/30 text-violet-200">
                    {{ photo.badge }}
                  </span>
                }

                <!-- Hover Overlay with Lens Icon -->
                <div class="absolute inset-0 bg-violet-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span class="px-4 py-2 rounded-full bg-slate-900/90 text-white text-xs font-semibold flex items-center gap-2 border border-emerald-400/50 shadow-xl">
                    <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <span>Vista Detallada</span>
                  </span>
                </div>
              </div>

              <!-- Card Body -->
              <div class="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
                <div class="space-y-2">
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="font-editorial text-2xl font-normal text-white group-hover:text-emerald-200 transition-colors leading-snug">
                      {{ photo.title }}
                    </h4>
                    <span class="font-mono text-base font-bold text-emerald-300 flex-shrink-0">
                      \${{ photo.price }}
                    </span>
                  </div>

                  <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                    {{ photo.description }}
                  </p>
                </div>

                <!-- Technical Camera Sheet Badge -->
                <div class="badge-tech-sheet p-2.5 rounded-xl text-[11px] font-mono leading-tight space-y-0.5 shadow-inner">
                  <div class="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>Ficha Técnica:</span>
                  </div>
                  <div class="text-slate-200 truncate">
                    {{ photo.technicalSheet }}
                  </div>
                </div>

                <!-- Footer: Dimensions & Cart CTA -->
                <div class="pt-3 border-t border-violet-500/20 flex items-center justify-between gap-3">
                  <span class="text-[11px] text-slate-400 truncate">
                    {{ photo.dimensions }}
                  </span>

                  <button
                    type="button"
                    (click)="handleAddToCart(photo)"
                    class="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    [ngClass]="addedPhotoId() === photo.id 
                      ? 'bg-emerald-500 text-slate-950 font-bold' 
                      : 'btn-editorial-mint'">
                    @if (addedPhotoId() === photo.id) {
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>¡Agregada!</span>
                    } @else {
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                        <path d="M3 6h18"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                      <span>Adquirir Obra</span>
                    }
                  </button>
                </div>

              </div>

            </article>
          }
        </div>
      } @else {
        <!-- Empty Results Message -->
        <div class="py-16 text-center card-editorial rounded-3xl p-8 max-w-lg mx-auto space-y-4">
          <div class="w-12 h-12 rounded-full bg-violet-950/80 text-violet-400 flex items-center justify-center mx-auto border border-violet-500/30">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <h4 class="font-editorial text-2xl text-white font-normal">No se encontraron fotografías</h4>
          <p class="text-slate-300 text-sm max-w-md mx-auto">
            No hay obras que coincidan con "{{ shop.searchQuery() }}" en la carpeta seleccionada.
          </p>
          <button
            type="button"
            (click)="shop.setCategory('Todos'); shop.setSearchQuery('')"
            class="px-5 py-2.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-900 transition-colors">
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

  selectAlbum(category: string): void {
    this.shop.setCategory(category);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('galeria');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

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
