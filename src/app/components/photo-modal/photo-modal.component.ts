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
        class="modal-overlay-viewport fixed inset-0 z-50 bg-[#142417]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-fadeIn">
        
        <!-- Modal Card -->
        <div 
          (click)="$event.stopPropagation()"
          class="relative w-full max-w-5xl bg-[#142417] border border-[#86DEB7] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh] text-[#86DEB7]">
          
          <!-- Close Button -->
          <button
            type="button"
            (click)="shop.closePreview()"
            aria-label="Cerrar vista previa"
            class="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#63B995] text-[#142417] hover:bg-[#86DEB7] border border-[#86DEB7] shadow-md transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- Large Photo Preview Area -->
          <div class="lg:w-3/5 bg-[#142417] flex items-center justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#63B995]/30">
            <img
              [src]="photo.imageUrl"
              [alt]="photo.title"
              loading="lazy"
              decoding="async"
              class="w-full h-full max-h-[50vh] lg:max-h-[85vh] object-contain"/>
            
            <span class="absolute bottom-4 left-4 text-[11px] text-[#142417] bg-[#86DEB7] px-3.5 py-1 rounded-full border border-[#142417] font-bold shadow-md">
              {{ photo.dimensions }}
            </span>
          </div>

          <!-- Information & Purchase Area -->
          <div class="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-[#142417] space-y-6">
            
            <div class="space-y-4">
              <!-- Header Badges -->
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-[#142417] bg-[#86DEB7] px-3 py-1 rounded-full border border-[#142417]">
                  {{ photo.category }}
                </span>
                @if (photo.badge) {
                  <span class="text-xs font-bold text-[#142417] bg-[#63B995] px-3 py-1 rounded-full border border-[#86DEB7]">
                    {{ photo.badge }}
                  </span>
                }
              </div>

              <!-- Title & Description -->
              <h2 class="font-editorial text-3xl sm:text-4xl text-[#86DEB7] leading-tight font-bold">
                {{ photo.title }}
              </h2>
              <p class="text-[#86DEB7]/90 text-sm leading-relaxed font-medium font-sans">
                {{ photo.description }}
              </p>

              <!-- MANDATORY FICHA TÉCNICA DISPLAY -->
              <div class="p-4 rounded-2xl bg-[#63B995]/20 border border-[#86DEB7] space-y-2 shadow-md">
                <div class="text-xs font-bold uppercase tracking-wider text-[#86DEB7] flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-[#86DEB7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>Ficha Técnica Oficial</span>
                </div>
                <p class="text-xs text-[#86DEB7] font-mono leading-relaxed bg-[#142417] p-2.5 rounded-xl border border-[#63B995]">
                  {{ photo.technicalSheet }}
                </p>
              </div>

              <!-- Guarantees -->
              <ul class="space-y-2 text-xs text-[#86DEB7]/90 font-medium">
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-[#86DEB7] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Edición y calibración de color profesional de autor</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-[#86DEB7] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Entrega en alta resolución para impresión o uso comercial</span>
                </li>
              </ul>
            </div>

            <!-- Price & Actions -->
            <div class="pt-5 border-t border-[#63B995]/40">
              <div class="flex items-baseline justify-between mb-4">
                <span class="text-xs uppercase tracking-wider text-[#63B995] font-bold">Copia Fine Art</span>
                <div class="text-2xl font-editorial font-bold text-[#86DEB7]">
                  \${{ photo.price }} <span class="text-xs text-[#63B995] font-sans font-bold">USD</span>
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  type="button"
                  (click)="addToCartAndOpen(photo)"
                  class="w-full btn-editorial-mint py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg">
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
