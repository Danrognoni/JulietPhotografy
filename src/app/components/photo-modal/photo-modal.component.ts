import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';
import { Photo } from '../../models/photo.model';

@Component({
  selector: 'app-photo-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (shop.selectedPhoto(); as photo) {
      <!-- Backdrop -->
      <div 
        (click)="shop.closePreview()"
        class="fixed inset-0 z-50 bg-[#06010d]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fadeIn">
        
        <!-- Modal Card -->
        <div 
          (click)="$event.stopPropagation()"
          class="relative w-full max-w-5xl bg-[#110624] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-purple-950 flex flex-col lg:flex-row max-h-[90vh]">
          
          <!-- Close Button -->
          <button
            (click)="shop.closePreview()"
            aria-label="Cerrar vista previa"
            class="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#0c0418]/80 text-purple-200 hover:text-white hover:bg-purple-900/80 border border-purple-500/30 backdrop-blur-md transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- Large Photo Preview Area -->
          <div class="lg:w-3/5 bg-black flex items-center justify-center relative overflow-hidden group">
            <img
              [src]="photo.imageUrl"
              [alt]="photo.title"
              class="w-full h-full max-h-[50vh] lg:max-h-[85vh] object-contain"/>
            
            <span class="absolute bottom-4 left-4 text-[11px] text-purple-200 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-500/30 backdrop-blur-sm">
              {{ photo.dimensions }}
            </span>
          </div>

          <!-- Information & Purchase Area -->
          <div class="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-[#14082b] to-[#0f0520]">
            
            <div>
              <!-- Header Badges -->
              <div class="flex items-center gap-2 mb-3">
                <span class="text-xs uppercase font-bold text-fuchsia-300 bg-purple-900/60 px-3 py-1 rounded-full border border-purple-600/40">
                  {{ photo.category }}
                </span>
                @if (photo.badge) {
                  <span class="text-xs uppercase font-medium text-purple-300 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-800/40">
                    {{ photo.badge }}
                  </span>
                }
              </div>

              <!-- Title & Description -->
              <h2 class="font-display font-bold text-2xl sm:text-3xl text-white mb-3 leading-tight">
                {{ photo.title }}
              </h2>
              <p class="text-purple-200/80 text-sm leading-relaxed mb-6 font-light">
                {{ photo.description }}
              </p>

              <!-- Technical EXIF Camera Info -->
              @if (photo.cameraDetails) {
                <div class="p-4 rounded-2xl bg-[#190b33]/60 border border-purple-700/30 mb-6 space-y-2">
                  <div class="text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-fuchsia-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>Ficha Técnica de Captura</span>
                  </div>

                  <div class="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span class="text-purple-400/70 block">Cámara</span>
                      <span class="text-white font-medium">{{ photo.cameraDetails.camera }}</span>
                    </div>
                    <div>
                      <span class="text-purple-400/70 block">Óptica</span>
                      <span class="text-white font-medium">{{ photo.cameraDetails.lens }}</span>
                    </div>
                    <div>
                      <span class="text-purple-400/70 block">Apertura</span>
                      <span class="text-white font-medium">{{ photo.cameraDetails.aperture }}</span>
                    </div>
                    <div>
                      <span class="text-purple-400/70 block">Velocidad / ISO</span>
                      <span class="text-white font-medium">{{ photo.cameraDetails.shutter }} · {{ photo.cameraDetails.iso }}</span>
                    </div>
                  </div>
                </div>
              }

              <!-- Print & Quality Guarantees -->
              <ul class="space-y-2 text-xs text-purple-300/80 mb-6">
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Impresión Giclée de archivo con tintas pigmentadas UltraChrome</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Certificado de autenticidad holográfico numerado</span>
                </li>
              </ul>
            </div>

            <!-- Price & Actions -->
            <div class="pt-6 border-t border-purple-900/40">
              <div class="flex items-baseline justify-between mb-4">
                <span class="text-xs uppercase tracking-wider text-purple-300/70">Inversión Artística</span>
                <div class="text-3xl font-display font-bold text-white">
                  \${{ photo.price }} <span class="text-sm text-purple-400 font-normal">USD</span>
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  (click)="addToCartAndOpen(photo)"
                  class="flex-1 btn-neon-violet py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                    <path d="M3 6h18"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  <span>Añadir a Mi Colección</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    }
  `
})
export class PhotoModalComponent {
  readonly shop = inject(ShopService);

  addToCartAndOpen(photo: Photo): void {
    this.shop.addToCart(photo);
    this.shop.closePreview();
    this.shop.openCart();
  }
}
