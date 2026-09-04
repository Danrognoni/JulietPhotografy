import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../services/shop.service';
import { Photo, PhotoCategory } from '../../models/photo.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="galeria" class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div class="flex items-center gap-2 text-fuchsia-400 font-semibold text-xs uppercase tracking-widest mb-2">
            <span class="w-8 h-[2px] bg-gradient-to-r from-purple-500 to-fuchsia-500"></span>
            <span>Catálogo Exclusivo</span>
          </div>
          <h2 class="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Galería de Ventas
          </h2>
          <p class="text-purple-200/70 text-sm sm:text-base mt-2 max-w-xl font-light">
            Selección curada en ediciones seriadas. Cada fotografía se entrega con certificado de autenticidad firmado y numerado.
          </p>
        </div>

        <!-- Filter Controls & Search -->
        <div class="flex flex-wrap items-center gap-3">
          
          <!-- Category Tabs -->
          <div class="inline-flex p-1 rounded-2xl bg-[#130728] border border-purple-800/40 backdrop-blur-md">
            <button
              (click)="setFilter('Todos')"
              class="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200"
              [ngClass]="shop.selectedCategory() === 'Todos' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-900/50' : 'text-purple-300 hover:text-white hover:bg-purple-900/30'">
              Todos ({{ shop.photos().length }})
            </button>
            <button
              (click)="setFilter('Paisaje')"
              class="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200"
              [ngClass]="shop.selectedCategory() === 'Paisaje' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-900/50' : 'text-purple-300 hover:text-white hover:bg-purple-900/30'">
              Paisajes
            </button>
            <button
              (click)="setFilter('Producto')"
              class="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200"
              [ngClass]="shop.selectedCategory() === 'Producto' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-900/50' : 'text-purple-300 hover:text-white hover:bg-purple-900/30'">
              Productos
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative min-w-[220px]">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar obra..."
              [ngModel]="shop.searchQuery()"
              (ngModelChange)="onSearchChange($event)"
              class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-2xl bg-[#130728] border border-purple-800/40 text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 transition-all"/>
          </div>

        </div>
      </div>

      <!-- Photos Grid (Responsive CSS Grid) -->
      @if (shop.filteredPhotos().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          @for (photo of shop.filteredPhotos(); track photo.id) {
            <article class="glass-violet-card rounded-3xl overflow-hidden group flex flex-col justify-between border border-purple-800/30 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-1.5 shadow-xl shadow-purple-950/40">
              
              <!-- Image Container with Zoom Effect and Overlay -->
              <div class="relative aspect-[4/3] overflow-hidden bg-[#160b2c] cursor-pointer"
                   (click)="shop.openPreview(photo)">
                
                <img
                  [src]="photo.imageUrl"
                  [alt]="photo.title"
                  loading="lazy"
                  class="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-110"/>
                
                <!-- Subtle Gradient Overlay on Hover -->
                <div class="absolute inset-0 bg-gradient-to-t from-[#0d051c] via-[#0d051c]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                  
                  <!-- Top Hover Badges -->
                  <div class="flex justify-between items-start">
                    <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#0d051c]/80 text-purple-200 border border-purple-400/20 backdrop-blur-md">
                      {{ photo.category }}
                    </span>
                    
                    <button
                      (click)="$event.stopPropagation(); shop.openPreview(photo)"
                      title="Ver fotografía ampliada"
                      class="p-2 rounded-full bg-[#0d051c]/80 text-purple-200 hover:text-white hover:bg-purple-600/80 border border-purple-400/30 backdrop-blur-md transition-colors">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Bottom Hover Exif Details -->
                  @if (photo.cameraDetails) {
                    <div class="text-[11px] text-purple-200/90 bg-[#0d051c]/85 px-3 py-2 rounded-xl backdrop-blur-md border border-purple-500/20 space-y-0.5">
                      <div class="font-medium text-white flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 text-fuchsia-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        <span>{{ photo.cameraDetails.camera }}</span>
                      </div>
                      <div class="text-purple-300/80 font-mono text-[10px]">
                        {{ photo.cameraDetails.lens }} · {{ photo.cameraDetails.aperture }} · {{ photo.cameraDetails.shutter }} · {{ photo.cameraDetails.iso }}
                      </div>
                    </div>
                  }
                </div>

                <!-- Static Badge (e.g. Edición Limitada / Bestseller) -->
                @if (photo.badge) {
                  <span class="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/40 backdrop-blur-md shadow-md shadow-purple-950/80 group-hover:opacity-0 transition-opacity">
                    {{ photo.badge }}
                  </span>
                }
              </div>

              <!-- Content Section in Soft Lilac / Deep Violet Harmony -->
              <div class="p-6 flex flex-col flex-grow justify-between bg-gradient-to-b from-[#150a2b]/80 to-[#120726]">
                
                <div>
                  <div class="flex items-center justify-between gap-2 mb-1.5">
                    <!-- Soft Lilac Category Pill -->
                    <span class="text-xs font-semibold uppercase tracking-wider text-purple-300 bg-purple-900/40 px-2.5 py-0.5 rounded-md border border-purple-700/30">
                      {{ photo.category }}
                    </span>
                    <span class="text-[11px] text-purple-300/60 font-light">
                      {{ photo.dimensions }}
                    </span>
                  </div>

                  <!-- Photo Title -->
                  <h3 
                    (click)="shop.openPreview(photo)"
                    class="font-display font-bold text-lg sm:text-xl text-white group-hover:text-purple-300 transition-colors cursor-pointer mt-1 line-clamp-1">
                    {{ photo.title }}
                  </h3>

                  <!-- Brief description -->
                  <p class="text-purple-200/70 text-xs sm:text-sm mt-2 line-clamp-2 font-light leading-relaxed">
                    {{ photo.description }}
                  </p>
                </div>

                <!-- Price & Add To Cart CTA Button with strong contrast -->
                <div class="pt-5 mt-5 border-t border-purple-900/30 flex items-center justify-between gap-3">
                  <div>
                    <span class="text-[10px] uppercase tracking-wider text-purple-300/60 block">Precio Obra</span>
                    <div class="text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-fuchsia-300">
                      \${{ photo.price }} <span class="text-xs text-purple-400 font-normal">USD</span>
                    </div>
                  </div>

                  <!-- CTA Button with Strong Contrast & Immediate Feedback -->
                  <button
                    (click)="handleAddToCart(photo)"
                    [disabled]="addedPhotoId() === photo.id"
                    class="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 group/btn"
                    [ngClass]="addedPhotoId() === photo.id 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' 
                      : 'btn-neon-violet'">
                    
                    @if (addedPhotoId() === photo.id) {
                      <svg class="w-4 h-4 animate-scaleCheck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>¡Añadido!</span>
                    } @else {
                      <svg class="w-4 h-4 transform group-hover/btn:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
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
        <div class="text-center py-20 bg-[#120726]/60 rounded-3xl border border-purple-900/30 p-8">
          <div class="w-16 h-16 rounded-full bg-purple-900/30 text-purple-400 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <h3 class="font-display text-xl font-bold text-white mb-2">No se encontraron fotografías</h3>
          <p class="text-purple-300/70 text-sm max-w-md mx-auto mb-6">
            No hay obras que coincidan con "{{ shop.searchQuery() }}" en la categoría seleccionada.
          </p>
          <button
            (click)="shop.setCategory('Todos'); shop.setSearchQuery('')"
            class="px-5 py-2.5 rounded-xl bg-purple-800/40 text-purple-200 hover:text-white border border-purple-600/40 text-sm">
            Restablecer Filtros
          </button>
        </div>
      }

    </section>
  `
})
export class GalleryComponent {
  readonly shop = inject(ShopService);
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

    // Reset button after 1.5 seconds
    setTimeout(() => {
      if (this.addedPhotoId() === photo.id) {
        this.addedPhotoId.set(null);
      }
    }, 1500);
  }
}
