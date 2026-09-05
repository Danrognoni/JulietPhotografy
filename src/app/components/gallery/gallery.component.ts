import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';
import { Photo, PhotoCategory } from '../../models/photo.model';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, ScrollRevealDirective],
  template: `
    <!-- SECTION 1: ÁLBUMES & COLECCIONES (MOSAICO EDITORIAL ASIMÉTRICO FULL-WIDTH) -->
    <section id="albumes" class="py-16 md:py-24 w-full px-3 sm:px-4 md:px-6 relative">
      
      <!-- Section Header -->
      <div 
        appScrollReveal 
        [revealDelay]="0"
        class="max-w-7xl mx-auto px-2 sm:px-4 flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div class="inline-flex items-center gap-2 text-[#86DEB7] text-xs font-semibold uppercase tracking-[0.25em] mb-2.5">
            <span class="w-6 h-[1px] bg-[#86DEB7]"></span>
            <span>Series & Colecciones</span>
          </div>
          <h2 class="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white font-light tracking-tight">
            Álbumes Temáticos
          </h2>
          <p class="text-slate-300/90 text-sm sm:text-base mt-2.5 max-w-xl font-sans font-light leading-relaxed">
            Explora los diferentes cuerpos de trabajo en una composición editorial continua. Haz clic en cualquier serie para explorar sus obras.
          </p>
        </div>

        <!-- Quick Reset to All -->
        @if (shop.selectedCategory() !== 'Todos') {
          <button
            type="button"
            (click)="selectAlbum('Todos')"
            class="px-4 py-2 rounded-full bg-[#50723C]/40 border border-[#86DEB7]/40 text-[#86DEB7] text-xs font-medium hover:bg-[#63B995]/60 hover:text-white transition-all flex items-center gap-2 self-start md:self-auto backdrop-blur-md">
            <span>Ver Todas las Carpetas</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        }
      </div>

      <!-- Albums Full-Width Asymmetrical Dense Mosaic Grid -->
      <div class="album-mosaic-grid w-full">
        @for (folder of shop.albumFolders(); track folder.id; let idx = $index) {
          <article 
            appScrollReveal
            [revealDelay]="(idx % 5) * 80"
            (click)="selectAlbum(folder.category)"
            class="relative w-full h-full overflow-hidden rounded-2xl bg-[#0f0920] group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/5"
            [ngClass]="[
              getAlbumSpanClass(idx),
              shop.selectedCategory() === folder.category ? 'ring-2 ring-[#86DEB7] ring-offset-2 ring-offset-[#0c0817]' : ''
            ]">
            
            @if (folder.count > 0 && folder.coverImage) {
              <!-- Cover Photo with Subtle Zoom -->
              <img
                [src]="folder.coverImage"
                [alt]="folder.name"
                loading="lazy"
                decoding="async"
                class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"/>
            } @else {
              <!-- Elegant Sober Empty State -->
              <div class="w-full h-full bg-gradient-to-br from-[#120826] via-[#100720] to-[#0c051a] flex flex-col items-center justify-center p-6 text-center">
                <div class="w-12 h-12 rounded-xl border border-[#86DEB7]/20 bg-[#190e32]/60 flex items-center justify-center text-[#86DEB7]/60 mb-2">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
                <span class="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Serie en Preparación</span>
              </div>
            }

            <!-- Static Bottom Caption (Always visible gently before hover) -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#090514]/90 via-[#090514]/25 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-0"></div>
            <div class="absolute bottom-4 left-4 right-4 z-10 text-left transition-opacity duration-300 group-hover:opacity-0">
              <span class="text-[9px] font-mono tracking-[0.2em] uppercase text-[#86DEB7] block mb-0.5">
                Colección
              </span>
              <h3 class="font-editorial text-xl sm:text-2xl font-light text-white leading-tight">
                {{ folder.name }}
              </h3>
              <span class="text-[11px] font-mono text-slate-300/80">
                {{ folder.count }} {{ folder.count === 1 ? 'fotografía' : 'fotografías' }}
              </span>
            </div>

            <!-- Hover Overlay with #50723C and Subtle Central (+) Icon -->
            <div class="absolute inset-0 bg-[#50723C]/35 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col items-center justify-center p-6 text-center z-20">
              <div class="w-12 h-12 rounded-full border border-[#86DEB7] bg-[#0c0817]/70 text-[#86DEB7] flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300 mb-2.5">
                <svg class="w-6 h-6 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <h3 class="font-editorial text-2xl sm:text-3xl font-light text-white drop-shadow-md">
                {{ folder.name }}
              </h3>
              <span class="text-xs font-mono text-[#86DEB7] tracking-widest uppercase my-1 font-semibold">
                {{ folder.count }} {{ folder.count === 1 ? 'fotografía' : 'fotografías' }}
              </span>
              <p class="text-xs text-slate-200 font-sans font-light line-clamp-2 max-w-xs mt-1">
                {{ folder.description }}
              </p>
              <span class="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-white/90 bg-[#0c0817]/60 px-3 py-1 rounded-full border border-[#86DEB7]/30">
                <span>Explorar serie</span>
                <span>→</span>
              </span>
            </div>

            <!-- Top Indicator Pill if Active -->
            @if (shop.selectedCategory() === folder.category) {
              <div class="absolute top-3 left-3 z-30">
                <span class="px-2.5 py-0.5 rounded-full bg-[#86DEB7] text-[#0c0817] text-[10px] font-bold uppercase tracking-widest shadow-md">
                  Activo
                </span>
              </div>
            }

          </article>
        }
      </div>

    </section>

    <!-- Seamless Subtle Divider -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="h-[1px] bg-gradient-to-r from-transparent via-[#86DEB7]/20 to-transparent"></div>
    </div>

    <!-- SECTION 2: PORTAFOLIO DETALLADO (FILTROS MINIMALISTAS & OBRAS) -->
    <section id="galeria" class="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      
      <!-- Filter Bar & Search Header -->
      <div 
        appScrollReveal
        [revealDelay]="50"
        class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 pb-6 border-b border-violet-500/15">
        <div>
          <span class="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#86DEB7] block mb-2">
            Catálogo de Fotografías
          </span>
          <h3 class="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white font-light">
            {{ shop.selectedCategory() === 'Todos' ? 'Todas las Fotografías' : 'Colección: ' + shop.selectedCategory() }}
            <span class="text-xs sm:text-sm font-sans text-violet-300/70 ml-2 font-normal">
              ({{ shop.filteredPhotos().length }} obras)
            </span>
          </h3>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          
          <!-- Category Filter Tabs (Minimalist Pixpa Text Tabs with Active Underline #86DEB7) -->
          <nav aria-label="Filtro de categorías" class="flex flex-wrap items-center gap-4 sm:gap-6 border-b border-white/5 pb-2 sm:pb-0 sm:border-b-0">
            @for (cat of categories(); track cat) {
              <button
                type="button"
                (click)="setFilter(cat)"
                class="text-xs tracking-[0.2em] uppercase font-medium py-1.5 relative transition-colors"
                [ngClass]="shop.selectedCategory() === cat 
                  ? 'text-[#86DEB7] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#86DEB7]' 
                  : 'text-slate-400 hover:text-white'">
                {{ cat }}
              </button>
            }
          </nav>

          <!-- Search Input -->
          <div class="relative min-w-[200px] w-full sm:w-auto">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#86DEB7]/70">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar obra, cámara..."
              [ngModel]="shop.searchQuery()"
              (ngModelChange)="onSearchChange($event)"
              class="w-full pl-8 pr-3 py-1.5 text-xs rounded-full bg-[#120826]/80 border border-violet-500/25 text-white placeholder-slate-400/50 focus:outline-none focus:border-[#86DEB7] focus:ring-1 focus:ring-[#86DEB7]/30 transition-all"/>
          </div>

        </div>
      </div>

      <!-- Photos Open Grid (Responsive Editorial Grid without Boxes) -->
      @if (shop.filteredPhotos().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          @for (photo of shop.filteredPhotos(); track photo.id; let idx = $index) {
            <article 
              appScrollReveal
              [revealDelay]="(idx % 6) * 90"
              class="group flex flex-col justify-start relative">
              
              <!-- ADMIN ON-CARD ACTION BADGES (RENDERED ONLY IF LOGGED IN) -->
              @if (auth.isAdmin()) {
                <div class="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-[#0c0817]/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-[#86DEB7]/40">
                  <button
                    type="button"
                    (click)="editPhotoAdmin(photo)"
                    title="Editar fotografía"
                    class="p-1.5 rounded-lg text-[#86DEB7] hover:bg-[#50723C]/60 hover:text-white transition-colors">
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

              <!-- Image Frame with Lightbox Click -->
              <div 
                (click)="shop.openPreview(photo)"
                class="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl bg-[#0f0920] cursor-pointer shadow-xl group-hover:shadow-2xl transition-all duration-500">
                
                <img
                  [src]="photo.imageUrl"
                  [alt]="photo.title"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"/>
                
                <!-- Category Badge -->
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase border shadow-md backdrop-blur-md bg-[#0c0817]/75 border-white/10 text-[#86DEB7]">
                  {{ photo.category }}
                </span>

                @if (photo.badge) {
                  <span class="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-[#0c0817]/85 border border-violet-500/30 text-violet-200">
                    {{ photo.badge }}
                  </span>
                }

                <!-- Hover Overlay with Lens Icon -->
                <div class="absolute inset-0 bg-[#090514]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span class="px-4 py-2 rounded-full bg-[#0c0817]/90 text-white text-xs font-medium flex items-center gap-2 border border-[#86DEB7]/40 shadow-xl">
                    <svg class="w-4 h-4 text-[#86DEB7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <span>Vista Detallada</span>
                  </span>
                </div>
              </div>

              <!-- Information Beneath Image -->
              <div class="pt-4 space-y-2">
                <div class="flex items-baseline justify-between gap-2">
                  <h4 class="font-editorial text-2xl font-light text-white group-hover:text-[#86DEB7] transition-colors leading-snug">
                    {{ photo.title }}
                  </h4>
                  <span class="font-mono text-base font-medium text-[#86DEB7] flex-shrink-0">
                    \${{ photo.price }}
                  </span>
                </div>

                <p class="text-xs text-slate-300/80 line-clamp-2 leading-relaxed font-sans font-light">
                  {{ photo.description }}
                </p>

                <!-- Technical Camera Sheet Badge -->
                <div class="pt-1 flex items-center gap-2 text-[11px] font-mono text-slate-400 truncate">
                  <svg class="w-3.5 h-3.5 text-[#86DEB7] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span class="truncate">{{ photo.technicalSheet }}</span>
                </div>

                <!-- Footer: Dimensions & Cart CTA -->
                <div class="pt-3 border-t border-violet-500/15 flex items-center justify-between gap-3">
                  <span class="text-[11px] font-mono text-slate-400/80 truncate">
                    {{ photo.dimensions }}
                  </span>

                  <button
                    type="button"
                    (click)="handleAddToCart(photo)"
                    class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
                    [ngClass]="addedPhotoId() === photo.id 
                      ? 'bg-[#86DEB7] text-[#0c0817] font-bold' 
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
        <div 
          appScrollReveal
          class="py-16 text-center max-w-lg mx-auto space-y-4">
          <div class="w-12 h-12 rounded-full bg-violet-950/60 text-violet-400 flex items-center justify-center mx-auto border border-violet-500/30">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <h4 class="font-editorial text-2xl text-white font-normal">No se encontraron fotografías</h4>
          <p class="text-slate-300 text-sm max-w-md mx-auto font-light">
            No hay obras que coincidan con "{{ shop.searchQuery() }}" en la serie seleccionada.
          </p>
          <button
            type="button"
            (click)="shop.setCategory('Todos'); shop.setSearchQuery('')"
            class="px-5 py-2.5 rounded-full bg-[#50723C]/80 border border-[#86DEB7]/40 text-[#86DEB7] text-xs font-semibold hover:bg-[#63B995] hover:text-white transition-colors">
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

  readonly categories = computed<(string | 'Todos')[]>(() => {
    return ['Todos', ...this.shop.albumCategories()];
  });

  getAlbumSpanClass(idx: number): string {
    const pattern = idx % 5;
    switch (pattern) {
      case 0:
        return 'sm:col-span-2 sm:row-span-2';
      case 1:
        return 'sm:col-span-1 sm:row-span-2';
      case 2:
        return 'sm:col-span-1 sm:row-span-1';
      case 3:
        return 'sm:col-span-1 sm:row-span-1';
      case 4:
        return 'sm:col-span-2 sm:row-span-1';
      default:
        return 'sm:col-span-1 sm:row-span-1';
    }
  }

  selectAlbum(category: string): void {
    this.shop.setCategory(category);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('galeria');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  setFilter(category: PhotoCategory | string | 'Todos'): void {
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

