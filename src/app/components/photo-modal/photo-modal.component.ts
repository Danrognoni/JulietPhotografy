import { Component, inject } from '@angular/core';
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
        class="modal-overlay-viewport fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-fadeIn">
        
        <!-- Modal Card -->
        <div 
          (click)="$event.stopPropagation()"
          class="relative w-full max-w-5xl bg-[#110826] border border-violet-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col lg:flex-row max-h-[90vh] text-slate-100">
          
          <!-- Close Button -->
          <button
            type="button"
            (click)="shop.closePreview()"
            aria-label="Cerrar vista previa"
            class="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#1e0e3e]/80 text-slate-300 hover:text-white hover:bg-violet-700 border border-violet-500/30 shadow-md transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- Large Photo Preview Area -->
          <div class="lg:w-3/5 bg-[#06030d] flex items-center justify-center relative overflow-hidden">
            <img
              [src]="photo.imageUrl"
              [alt]="photo.title"
              class="w-full h-full max-h-[50vh] lg:max-h-[85vh] object-contain"/>
            
            <span class="absolute bottom-4 left-4 text-[11px] text-emerald-300 bg-[#14082c]/90 px-3.5 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md shadow-md">
              {{ photo.dimensions }}
            </span>
          </div>

          <!-- Information & Purchase Area -->
          <div class="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-[#140b2e]/95 space-y-6">
            
            <div class="space-y-4">
              <!-- Header Badges -->
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                  {{ photo.category }}
                </span>
                @if (photo.badge) {
                  <span class="text-xs font-medium text-sky-300 bg-sky-950/70 px-3 py-1 rounded-full border border-sky-600/40">
                    {{ photo.badge }}
                  </span>
                }
              </div>

              <!-- Title & Description -->
              <h2 class="font-editorial text-3xl sm:text-4xl text-white leading-tight font-normal">
                {{ photo.title }}
              </h2>
              <p class="text-slate-300 text-sm leading-relaxed font-normal font-sans">
                {{ photo.description }}
              </p>

              <!-- MANDATORY FICHA TÉCNICA DISPLAY -->
              <div class="p-4 rounded-2xl bg-[#1a0e38] border border-violet-500/30 space-y-2 shadow-md">
                <div class="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>Ficha Técnica Oficial</span>
                </div>
                <p class="text-xs text-slate-200 font-mono leading-relaxed bg-[#0b0518] p-2.5 rounded-xl border border-violet-600/30">
                  {{ photo.technicalSheet }}
                </p>
              </div>

              <!-- Guarantees -->
              <ul class="space-y-2 text-xs text-slate-300">
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Edición y calibración de color profesional de autor</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Entrega en alta resolución para impresión o uso comercial</span>
                </li>
              </ul>
            </div>

            <!-- Price & Actions -->
            <div class="pt-5 border-t border-violet-500/20">
              <div class="flex items-baseline justify-between mb-4">
                <span class="text-xs uppercase tracking-wider text-slate-400 font-medium">Copia Fine Art</span>
                <div class="text-2xl font-editorial font-bold text-emerald-300">
                  \${{ photo.price }} <span class="text-xs text-slate-400 font-sans font-normal">USD</span>
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  type="button"
                  (click)="addToCartAndOpen(photo)"
                  class="w-full btn-editorial-mint py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                    <path d="M3 6h18"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  <span>Añadir a mi Selección</span>
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
