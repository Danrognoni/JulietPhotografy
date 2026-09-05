import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (shop.isCartOpen()) {
      <!-- Backdrop with blur -->
      <div 
        (click)="shop.closeCart()"
        class="modal-overlay-viewport fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity duration-300">
      </div>

      <!-- Slide-over Drawer -->
      <div class="fixed top-0 bottom-0 right-0 z-50 h-full max-h-screen w-full max-w-md bg-[#110826] border-l border-violet-500/30 shadow-2xl shadow-black/80 flex flex-col justify-between animate-slideLeft text-slate-100">
        
        <!-- Drawer Header -->
        <div class="p-5 border-b border-violet-500/20 flex items-center justify-between bg-[#150a30]">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div>
              <h3 class="font-editorial text-2xl font-normal text-white">Carrito de Obras</h3>
              <p class="text-xs text-slate-300">{{ shop.cartCount() }} {{ shop.cartCount() === 1 ? 'fotografía seleccionada' : 'fotografías seleccionadas' }}</p>
            </div>
          </div>

          <button
            type="button"
            (click)="shop.closeCart()"
            aria-label="Cerrar carrito"
            class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-violet-900/40 transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Items List -->
        <div class="flex-grow overflow-y-auto p-5 space-y-3.5 bg-[#0b0518]">
          @if (checkoutSuccess()) {
            <!-- Checkout Success State -->
            <div class="py-12 text-center space-y-4 animate-fadeIn">
              <div class="w-16 h-16 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h4 class="font-editorial text-3xl font-normal text-white">¡Adquisición Registrada!</h4>
              <p class="text-slate-300 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed font-sans">
                Muchas gracias. Julieta se pondrá en contacto para coordinar la entrega o retiro en Mar del Plata.
              </p>
              <button
                type="button"
                (click)="resetCheckout()"
                class="btn-editorial-mint px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider mt-2">
                Continuar Explorando
              </button>
            </div>
          } @else if (shop.cart().length > 0) {
            @for (item of shop.cart(); track item.photo.id) {
              <div class="p-3.5 rounded-2xl bg-[#150a30]/80 border border-violet-500/25 flex gap-3.5 items-center group shadow-md">
                <img
                  [src]="item.photo.imageUrl"
                  [alt]="item.photo.title"
                  loading="lazy"
                  decoding="async"
                  class="w-16 h-16 object-cover rounded-xl border border-violet-500/30 flex-shrink-0"/>

                <div class="flex-grow min-w-0">
                  <div class="flex items-center justify-between gap-1">
                    <span class="text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/40">
                      {{ item.photo.category }}
                    </span>
                    <button
                      type="button"
                      (click)="shop.removeFromCart(item.photo.id)"
                      title="Eliminar del carrito"
                      class="text-slate-400 hover:text-rose-400 transition-colors p-1">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>

                  <h4 class="font-editorial text-lg text-white truncate group-hover:text-emerald-300 transition-colors mt-0.5">
                    {{ item.photo.title }}
                  </h4>

                  <div class="flex items-center justify-between mt-2">
                    <span class="text-xs font-bold text-emerald-300 font-mono">
                      \${{ item.photo.price }} USD
                    </span>

                    <!-- Quantity Adjuster -->
                    <div class="flex items-center gap-2 bg-[#0d061e] px-2 py-0.5 rounded-lg border border-violet-700/40">
                      <button
                        type="button"
                        (click)="shop.updateQuantity(item.photo.id, -1)"
                        aria-label="Disminuir cantidad"
                        class="text-slate-400 hover:text-white text-xs font-bold px-1">-</button>
                      <span class="text-xs font-bold text-white min-w-[12px] text-center">{{ item.quantity }}</span>
                      <button
                        type="button"
                        (click)="shop.updateQuantity(item.photo.id, 1)"
                        aria-label="Aumentar cantidad"
                        class="text-slate-400 hover:text-white text-xs font-bold px-1">+</button>
                    </div>
                  </div>
                </div>
              </div>
            }
          } @else {
            <!-- Empty Cart State -->
            <div class="py-16 text-center space-y-3">
              <div class="w-14 h-14 rounded-2xl bg-[#160a32] text-slate-400 flex items-center justify-center mx-auto border border-violet-500/20">
                <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                  <path d="M3 6h18"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <h4 class="font-editorial text-2xl text-white font-normal">El carrito está vacío</h4>
              <p class="text-slate-400 text-xs max-w-xs mx-auto font-sans">
                Explora el portafolio para seleccionar fotografías fine art de paisajes o producto.
              </p>
              <button
                type="button"
                (click)="shop.closeCart()"
                class="btn-editorial-mint px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mt-1">
                Ver Fotos
              </button>
            </div>
          }
        </div>

        <!-- Drawer Footer -->
        @if (shop.cart().length > 0 && !checkoutSuccess()) {
          <div class="p-5 border-t border-violet-500/20 bg-[#150a30] space-y-3.5">
            <div class="space-y-1.5 text-xs text-slate-300">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span class="font-semibold text-white">\${{ shop.cartTotal() }} USD</span>
              </div>
              <div class="flex justify-between">
                <span>Certificado de Impresión:</span>
                <span class="text-emerald-400 font-medium">Incluido</span>
              </div>
              <div class="flex justify-between text-sm font-bold text-white pt-2 border-t border-violet-800/40">
                <span>Total Estimado:</span>
                <span class="text-xl font-editorial text-emerald-300 font-bold">
                  \${{ shop.cartTotal() }} USD
                </span>
              </div>
            </div>

            <button
              type="button"
              (click)="processCheckout()"
              class="w-full btn-editorial-mint py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              <span>Confirmar Selección</span>
            </button>

            <button
              type="button"
              (click)="shop.clearCart()"
              class="w-full text-center text-xs text-slate-400 hover:text-rose-400 transition-colors">
              Vaciar carrito
            </button>
          </div>
        }

      </div>
    }
  `
})
export class CartDrawerComponent {
  readonly shop = inject(ShopService);
  readonly checkoutSuccess = signal<boolean>(false);

  processCheckout(): void {
    this.checkoutSuccess.set(true);
    this.shop.clearCart();
  }

  resetCheckout(): void {
    this.checkoutSuccess.set(false);
    this.shop.closeCart();
  }
}
