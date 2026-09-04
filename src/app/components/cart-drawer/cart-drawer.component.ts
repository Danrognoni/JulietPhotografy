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
        class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300">
      </div>

      <!-- Slide-over Drawer -->
      <div class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between animate-slideLeft">
        
        <!-- Drawer Header -->
        <div class="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div>
              <h3 class="font-display font-bold text-base text-slate-900">Carrito de Obras</h3>
              <p class="text-xs text-slate-500">{{ shop.cartCount() }} {{ shop.cartCount() === 1 ? 'fotografía seleccionada' : 'fotografías seleccionadas' }}</p>
            </div>
          </div>

          <button
            (click)="shop.closeCart()"
            aria-label="Cerrar carrito"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Items List -->
        <div class="flex-grow overflow-y-auto p-5 space-y-3.5">
          @if (checkoutSuccess()) {
            <!-- Checkout Success State -->
            <div class="py-12 text-center space-y-4 animate-fadeIn">
              <div class="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h4 class="font-display font-bold text-xl text-slate-900">¡Adquisición Registrada!</h4>
              <p class="text-slate-600 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
                Muchas gracias. Julieta se pondrá en contacto para coordinar la entrega o retiro en Mar del Plata.
              </p>
              <button
                (click)="resetCheckout()"
                class="btn-fresh-gradient px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold mt-2">
                Continuar Explorando
              </button>
            </div>
          } @else if (shop.cart().length > 0) {
            @for (item of shop.cart(); track item.photo.id) {
              <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3.5 items-center group">
                <img
                  [src]="item.photo.imageUrl"
                  [alt]="item.photo.title"
                  class="w-16 h-16 object-cover rounded-xl border border-slate-200 flex-shrink-0"/>

                <div class="flex-grow min-w-0">
                  <div class="flex items-center justify-between gap-1">
                    <span class="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                      {{ item.photo.category }}
                    </span>
                    <button
                      (click)="shop.removeFromCart(item.photo.id)"
                      title="Eliminar del carrito"
                      class="text-slate-400 hover:text-red-500 transition-colors p-1">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>

                  <h5 class="font-display font-semibold text-xs sm:text-sm text-slate-900 truncate mt-1">
                    {{ item.photo.title }}
                  </h5>
                  
                  <div class="flex items-center justify-between mt-2">
                    <div class="text-xs sm:text-sm font-bold text-slate-900">
                      \${{ item.photo.price * item.quantity }} <span class="text-[10px] text-teal-700">USD</span>
                    </div>

                    <div class="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                      <button
                        (click)="shop.updateQuantity(item.photo.id, -1)"
                        class="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 text-xs font-bold">
                        -
                      </button>
                      <span class="text-xs font-semibold text-slate-800 min-w-[12px] text-center">
                        {{ item.quantity }}
                      </span>
                      <button
                        (click)="shop.updateQuantity(item.photo.id, 1)"
                        class="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 text-xs font-bold">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          } @else {
            <div class="py-16 text-center space-y-3">
              <div class="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                  <path d="M3 6h18"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <h4 class="font-display font-bold text-base text-slate-800">El carrito está vacío</h4>
              <p class="text-slate-500 text-xs max-w-xs mx-auto">
                Explora el portafolio para seleccionar fotografías fine art de paisajes o producto.
              </p>
              <button
                (click)="shop.closeCart()"
                class="btn-fresh-gradient px-4 py-2 rounded-xl text-xs font-semibold mt-1">
                Ver Fotos
              </button>
            </div>
          }
        </div>

        <!-- Drawer Footer -->
        @if (shop.cart().length > 0 && !checkoutSuccess()) {
          <div class="p-5 border-t border-slate-200 bg-slate-50 space-y-3.5">
            <div class="space-y-1.5 text-xs text-slate-600">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span class="font-semibold text-slate-900">\${{ shop.cartTotal() }} USD</span>
              </div>
              <div class="flex justify-between">
                <span>Certificado de Impresión:</span>
                <span class="text-teal-700 font-medium">Incluido</span>
              </div>
              <div class="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Estimado:</span>
                <span class="text-base font-display text-teal-800 font-bold">
                  \${{ shop.cartTotal() }} USD
                </span>
              </div>
            </div>

            <button
              (click)="processCheckout()"
              class="w-full btn-fresh-gradient py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              <span>Confirmar Selección</span>
            </button>

            <button
              (click)="shop.clearCart()"
              class="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors">
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
