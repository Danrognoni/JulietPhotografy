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
        class="fixed inset-0 z-50 bg-[#080210]/80 backdrop-blur-sm transition-opacity duration-300">
      </div>

      <!-- Slide-over Drawer -->
      <div class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0e051c] border-l border-purple-800/40 shadow-2xl shadow-purple-950 flex flex-col justify-between animate-slideLeft">
        
        <!-- Drawer Header -->
        <div class="p-6 border-b border-purple-900/40 flex items-center justify-between bg-[#140828]/50">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-purple-900/40 text-purple-300 border border-purple-700/30">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div>
              <h3 class="font-display font-bold text-lg text-white">Tu Carrito de Obras</h3>
              <p class="text-xs text-purple-300/70">{{ shop.cartCount() }} {{ shop.cartCount() === 1 ? 'fotografía seleccionada' : 'fotografías seleccionadas' }}</p>
            </div>
          </div>

          <button
            (click)="shop.closeCart()"
            aria-label="Cerrar carrito"
            class="p-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/40 border border-purple-800/40 transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Items List -->
        <div class="flex-grow overflow-y-auto p-6 space-y-4">
          @if (checkoutSuccess()) {
            <!-- Checkout Success State -->
            <div class="py-12 text-center space-y-4 animate-fadeIn">
              <div class="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                <svg class="w-8 h-8 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h4 class="font-display font-bold text-2xl text-white">¡Orden Completada!</h4>
              <p class="text-purple-200/70 text-sm max-w-xs mx-auto leading-relaxed">
                Gracias por adquirir arte de autor. Te hemos enviado el certificado digital y los detalles de envío a tu correo.
              </p>
              <button
                (click)="resetCheckout()"
                class="btn-neon-violet px-6 py-2.5 rounded-xl text-sm font-bold mt-4">
                Continuar Explorando
              </button>
            </div>
          } @else if (shop.cart().length > 0) {
            @for (item of shop.cart(); track item.photo.id) {
              <div class="p-4 rounded-2xl bg-[#15092a]/80 border border-purple-800/30 flex gap-4 items-center group">
                <!-- Image Thumbnail -->
                <img
                  [src]="item.photo.imageUrl"
                  [alt]="item.photo.title"
                  class="w-18 h-18 object-cover rounded-xl border border-purple-700/40 flex-shrink-0"/>

                <!-- Details -->
                <div class="flex-grow min-w-0">
                  <div class="flex items-center justify-between gap-1">
                    <span class="text-[10px] uppercase font-semibold text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded">
                      {{ item.photo.category }}
                    </span>
                    <!-- Remove Button -->
                    <button
                      (click)="shop.removeFromCart(item.photo.id)"
                      title="Eliminar de carrito"
                      class="text-purple-400/60 hover:text-red-400 transition-colors p-1">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>

                  <h5 class="font-display font-semibold text-sm text-white truncate mt-1">
                    {{ item.photo.title }}
                  </h5>
                  
                  <div class="flex items-center justify-between mt-2">
                    <div class="text-sm font-bold text-fuchsia-300 font-display">
                      \${{ item.photo.price * item.quantity }} <span class="text-[10px] text-purple-400">USD</span>
                    </div>

                    <!-- Quantity Adjusters -->
                    <div class="flex items-center gap-2 bg-[#0c0418] px-2 py-1 rounded-lg border border-purple-800/40">
                      <button
                        (click)="shop.updateQuantity(item.photo.id, -1)"
                        class="w-5 h-5 flex items-center justify-center text-purple-300 hover:text-white text-xs font-bold">
                        -
                      </button>
                      <span class="text-xs font-semibold text-white min-w-[12px] text-center">
                        {{ item.quantity }}
                      </span>
                      <button
                        (click)="shop.updateQuantity(item.photo.id, 1)"
                        class="w-5 h-5 flex items-center justify-center text-purple-300 hover:text-white text-xs font-bold">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          } @else {
            <!-- Empty Cart State -->
            <div class="py-16 text-center space-y-4">
              <div class="w-16 h-16 rounded-full bg-purple-900/30 text-purple-400 flex items-center justify-center mx-auto border border-purple-800/30">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                  <path d="M3 6h18"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <h4 class="font-display font-bold text-xl text-white">Tu carrito está vacío</h4>
              <p class="text-purple-300/60 text-xs sm:text-sm max-w-xs mx-auto">
                Explora el catálogo de paisajes y fotografía de producto para añadir obras exclusivas.
              </p>
              <button
                (click)="shop.closeCart()"
                class="btn-neon-violet px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold mt-2 inline-block">
                Ver Catálogo
              </button>
            </div>
          }
        </div>

        <!-- Drawer Footer (Total & Checkout) -->
        @if (shop.cart().length > 0 && !checkoutSuccess()) {
          <div class="p-6 border-t border-purple-900/40 bg-[#130727]/80 space-y-4">
            
            <div class="space-y-2 text-xs text-purple-300/80">
              <div class="flex justify-between">
                <span>Subtotal de obras:</span>
                <span class="font-semibold text-white">\${{ shop.cartTotal() }} USD</span>
              </div>
              <div class="flex justify-between">
                <span>Certificado Fine Art & Envío:</span>
                <span class="text-fuchsia-400 font-medium">Incluido</span>
              </div>
              <div class="flex justify-between text-base font-bold text-white pt-2 border-t border-purple-900/30">
                <span>Total Estimado:</span>
                <span class="text-xl font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-fuchsia-400">
                  \${{ shop.cartTotal() }} USD
                </span>
              </div>
            </div>

            <!-- Checkout CTA -->
            <button
              (click)="processCheckout()"
              class="w-full btn-neon-violet py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              <span>Proceder al Pago Seguro</span>
            </button>

            <button
              (click)="shop.clearCart()"
              class="w-full text-center text-xs text-purple-400 hover:text-purple-200 transition-colors py-1">
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
