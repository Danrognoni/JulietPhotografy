import { Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService, OrderRequest } from '../../services/shop.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (shop.isCartOpen()) {
      <!-- Backdrop with blur -->
      <div 
        (click)="shop.closeCart()"
        class="modal-overlay-viewport fixed inset-0 z-50 bg-[#142417]/85 backdrop-blur-sm transition-opacity duration-300">
      </div>

      <!-- Slide-over Drawer -->
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de Obras Fotográficas"
        class="fixed top-0 bottom-0 right-0 z-50 h-full max-h-screen w-full max-w-md bg-[#142417] border-l border-[#86DEB7] shadow-2xl flex flex-col justify-between animate-slideLeft text-[#86DEB7]">
        
        <!-- Drawer Header -->
        <div class="p-5 border-b border-[#63B995]/40 flex items-center justify-between bg-[#142417]">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-[#63B995] border border-[#86DEB7] text-[#142417]">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div>
              <h3 class="font-editorial text-2xl font-bold text-[#86DEB7]">Carrito de Obras</h3>
              <p class="text-xs text-[#86DEB7]/90 font-medium">
                {{ shop.cartCount() }} {{ shop.cartCount() === 1 ? 'fotografía seleccionada' : 'fotografías seleccionadas' }}
              </p>
            </div>
          </div>

          <button
            type="button"
            (click)="shop.closeCart()"
            aria-label="Cerrar carrito"
            class="p-2 rounded-xl text-[#86DEB7] hover:bg-[#63B995] hover:text-[#142417] transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Items & Contact Form List -->
        <div class="flex-grow overflow-y-auto p-5 space-y-4 bg-[#142417]">
          
          <!-- Banner de Error si falló el backend o la preferencia -->
          @if (errorMessage()) {
            <div class="p-3.5 rounded-xl bg-red-950/70 border border-red-500/80 text-red-200 text-xs flex items-start gap-2.5 shadow-md animate-fadeIn">
              <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div class="flex-grow">
                <p class="font-semibold text-red-300">No se pudo procesar la compra</p>
                <p class="mt-0.5 text-red-200/90 leading-relaxed">{{ errorMessage() }}</p>
              </div>
              <button 
                type="button" 
                (click)="clearError()" 
                class="text-red-400 hover:text-white p-0.5" 
                aria-label="Cerrar error">
                ✕
              </button>
            </div>
          }

          @if (shop.cart().length > 0) {
            <!-- Lista de Fotografías seleccionadas -->
            <div class="space-y-3">
              @for (item of shop.cart(); track item.photo.id) {
                <div class="p-3.5 rounded-2xl bg-[#63B995]/20 border border-[#86DEB7] flex gap-3.5 items-center group shadow-md">
                  <img
                    [src]="item.photo.imageUrl"
                    [alt]="item.photo.title"
                    loading="lazy"
                    decoding="async"
                    class="w-16 h-16 object-cover rounded-xl border border-[#86DEB7] flex-shrink-0"/>

                  <div class="flex-grow min-w-0">
                    <div class="flex items-center justify-between gap-1">
                      <span class="text-[10px] font-bold text-[#142417] bg-[#86DEB7] px-2 py-0.5 rounded border border-[#142417]">
                        {{ item.photo.category }}
                      </span>
                      <button
                        type="button"
                        (click)="shop.removeFromCart(item.photo.id)"
                        title="Eliminar del carrito"
                        class="text-[#86DEB7] hover:text-[#142417] transition-colors p-1">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>

                    <h4 class="font-editorial text-lg text-[#86DEB7] truncate font-bold mt-0.5">
                      {{ item.photo.title }}
                    </h4>

                    <div class="flex items-center justify-between mt-2">
                      <span class="text-xs font-bold text-[#86DEB7] font-mono">
                        \${{ item.photo.price }} USD
                      </span>

                      <!-- Modificador de Cantidad -->
                      <div class="flex items-center gap-2 bg-[#142417] px-2 py-0.5 rounded-lg border border-[#86DEB7]">
                        <button
                          type="button"
                          (click)="shop.updateQuantity(item.photo.id, -1)"
                          aria-label="Disminuir cantidad"
                          class="text-[#86DEB7] hover:text-[#63B995] text-xs font-bold px-1">-</button>
                        <span class="text-xs font-bold text-[#86DEB7] min-w-[12px] text-center">{{ item.quantity }}</span>
                        <button
                          type="button"
                          (click)="shop.updateQuantity(item.photo.id, 1)"
                          aria-label="Aumentar cantidad"
                          class="text-[#86DEB7] hover:text-[#63B995] text-xs font-bold px-1">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Formulario Minimalista de Datos de Contacto para la Entrega -->
            <div class="pt-2 border-t border-[#63B995]/30 space-y-3">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-[#86DEB7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <h5 class="text-xs font-bold uppercase tracking-wider text-[#86DEB7]">
                  Datos de Entrega y Facturación
                </h5>
              </div>

              <div class="space-y-2.5">
                <div>
                  <label for="customerName" class="block text-[11px] font-medium text-[#86DEB7]/90 mb-1">
                    Nombre completo <span class="text-red-400">*</span>
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    [(ngModel)]="customerName"
                    (ngModelChange)="onCustomerDataChange()"
                    placeholder="Ej. Martín Alvarez"
                    class="w-full bg-[#142417] border border-[#86DEB7] rounded-xl px-3 py-2 text-xs text-[#86DEB7] placeholder-[#86DEB7]/40 focus:outline-none focus:ring-2 focus:ring-[#86DEB7]"
                  />
                </div>

                <div>
                  <label for="customerContact" class="block text-[11px] font-medium text-[#86DEB7]/90 mb-1">
                    Email o WhatsApp <span class="text-red-400">*</span>
                  </label>
                  <input
                    id="customerContact"
                    type="text"
                    [(ngModel)]="customerContact"
                    (ngModelChange)="onCustomerDataChange()"
                    placeholder="Ej. martin@gmail.com o 2235551234"
                    class="w-full bg-[#142417] border border-[#86DEB7] rounded-xl px-3 py-2 text-xs text-[#86DEB7] placeholder-[#86DEB7]/40 focus:outline-none focus:ring-2 focus:ring-[#86DEB7]"
                  />
                </div>

                <div>
                  <label for="customerNotes" class="block text-[11px] font-medium text-[#86DEB7]/90 mb-1">
                    Notas o instrucciones especiales (opcional)
                  </label>
                  <input
                    id="customerNotes"
                    type="text"
                    [(ngModel)]="customerNotes"
                    (ngModelChange)="onCustomerDataChange()"
                    placeholder="Ej. Preferencia de retiro en Mar del Plata o marco sugerido"
                    class="w-full bg-[#142417] border border-[#86DEB7]/60 rounded-xl px-3 py-2 text-xs text-[#86DEB7] placeholder-[#86DEB7]/40 focus:outline-none focus:ring-1 focus:ring-[#86DEB7]"
                  />
                </div>

                @if (validationError()) {
                  <p class="text-[11px] text-amber-300 font-medium animate-fadeIn">
                    ⚠️ {{ validationError() }}
                  </p>
                }
              </div>
            </div>

          } @else {
            <!-- Carrito Vacío -->
            <div class="py-16 text-center space-y-3">
              <div class="w-14 h-14 rounded-2xl bg-[#63B995] text-[#142417] flex items-center justify-center mx-auto border border-[#86DEB7]">
                <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                  <path d="M3 6h18"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <h4 class="font-editorial text-2xl text-[#86DEB7] font-bold">El carrito está vacío</h4>
              <p class="text-[#86DEB7]/90 text-xs max-w-xs mx-auto font-sans font-medium">
                Explora el portafolio para seleccionar fotografías fine art de paisajes, eventos o producto.
              </p>
              <button
                type="button"
                (click)="shop.closeCart()"
                class="btn-editorial-mint px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mt-1">
                Ver Fotos
              </button>
            </div>
          }
        </div>

        <!-- Drawer Footer: Resumen y Botón Mercado Pago -->
        @if (shop.cart().length > 0) {
          <div class="p-5 border-t border-[#63B995]/30 bg-[#142417] space-y-3.5 shadow-2xl">
            <div class="space-y-1.5 text-xs text-[#86DEB7]">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span class="font-bold text-[#86DEB7]">\${{ shop.cartTotal() }} USD</span>
              </div>
              <div class="flex justify-between">
                <span>Certificado de Impresión Fine Art:</span>
                <span class="text-[#86DEB7] font-bold">Incluido</span>
              </div>
              <div class="flex justify-between text-sm font-bold text-[#86DEB7] pt-2 border-t border-[#63B995]/40">
                <span>Total Estimado:</span>
                <span class="text-xl font-editorial text-[#86DEB7] font-bold">
                  \${{ shop.cartTotal() }} USD
                </span>
              </div>
            </div>

            <!-- Botón Oficial Checkout Pro de Mercado Pago -->
            <button
              id="btn-mercadopago-checkout"
              type="button"
              (click)="initiatePayment()"
              [disabled]="isCheckingOut() || shop.cart().length === 0"
              class="w-full relative overflow-hidden group bg-[#009EE3] hover:bg-[#0081bb] disabled:bg-[#009EE3]/50 disabled:cursor-not-allowed text-white py-3.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-[#009EE3]/30 transition-all duration-300">
              
              @if (isCheckingOut()) {
                <!-- Spinner de Carga -->
                <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="normal-case font-semibold text-sm">Conectando con Mercado Pago...</span>
              } @else {
                <!-- Logo Oficial Mercado Pago (Isotipo Handshake / Tarjeta) -->
                <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="16" fill="white"/>
                  <path d="M7 16.5C7 16.5 10 11.5 16 11.5C22 11.5 25 16.5 25 16.5C25 16.5 22 21.5 16 21.5C10 21.5 7 16.5 7 16.5Z" fill="#009EE3"/>
                  <circle cx="16" cy="16.5" r="3" fill="white"/>
                </svg>
                <span class="normal-case text-sm font-bold tracking-normal">Pagar con Mercado Pago</span>
              }
            </button>

            <div class="text-center space-y-1">
              <p class="text-[10px] text-[#86DEB7]/70 font-medium">
                🔒 Transacción 100% segura procesada por Checkout Pro
              </p>
              <p class="text-[9px] text-[#86DEB7]/50 font-mono">
                Tarjetas de crédito, débito y dinero en cuenta Mercado Pago
              </p>
            </div>

            <button
              type="button"
              (click)="shop.clearCart()"
              class="w-full text-center text-xs text-[#86DEB7]/80 hover:text-[#86DEB7] hover:underline transition-colors font-medium pt-1">
              Vaciar carrito
            </button>
          </div>
        }

      </div>
    }
  `
})
export class CartDrawerComponent implements OnInit {
  readonly shop = inject(ShopService);
  private readonly platformId = inject(PLATFORM_ID);

  // Datos del Cliente (Persistidos en localStorage para agilidad)
  customerName = '';
  customerContact = '';
  customerNotes = '';

  // Estados Reactivos
  readonly isCheckingOut = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly validationError = signal<string | null>(null);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const saved = localStorage.getItem('jm_checkout_customer');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.customerName = parsed.name || '';
          this.customerContact = parsed.contact || '';
          this.customerNotes = parsed.notes || '';
        }
      } catch (e) {
        console.warn('No se pudieron leer los datos del cliente guardados:', e);
      }
    }
  }

  onCustomerDataChange(): void {
    this.validationError.set(null);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('jm_checkout_customer', JSON.stringify({
          name: this.customerName,
          contact: this.customerContact,
          notes: this.customerNotes
        }));
      } catch (e) {
        console.warn('Error guardando datos de cliente:', e);
      }
    }
  }

  clearError(): void {
    this.errorMessage.set(null);
  }

  initiatePayment(): void {
    if (this.isCheckingOut()) return;

    // Validación de campos obligatorios requeridos por Spring Boot OrderRequestDto
    const name = this.customerName.trim();
    const contact = this.customerContact.trim();

    if (!name || !contact) {
      this.validationError.set('Por favor completa tu Nombre y Email o WhatsApp para coordinar tu pedido.');
      return;
    }

    if (this.shop.cart().length === 0) {
      this.validationError.set('El carrito no contiene fotografías seleccionadas.');
      return;
    }

    this.validationError.set(null);
    this.errorMessage.set(null);
    this.isCheckingOut.set(true);

    const orderPayload: OrderRequest = {
      customerName: name,
      customerContact: contact,
      notes: this.customerNotes.trim() || undefined,
      items: this.shop.cart().map(item => ({
        photoId: item.photo.id,
        quantity: item.quantity
      }))
    };

    this.shop.initiateMercadoPagoCheckout(orderPayload).subscribe({
      next: (resp) => {
        // Determinar URL de destino según bandera de Sandbox
        const targetUrl = environment.useMercadoPagoSandbox
          ? (resp.sandboxInitPoint || resp.initPoint)
          : (resp.initPoint || resp.sandboxInitPoint);

        if (isPlatformBrowser(this.platformId) && targetUrl) {
          // Redirigir de inmediato a la experiencia de Checkout Pro
          window.location.href = targetUrl;
        } else {
          this.isCheckingOut.set(false);
          this.errorMessage.set('No se pudo determinar la URL de cobro de Mercado Pago.');
        }
      },
      error: (err) => {
        this.isCheckingOut.set(false);
        const cleanMessage = this.shop.getCleanErrorMessage(err, 'iniciar el pago con Mercado Pago');
        this.errorMessage.set(cleanMessage);
      }
    });
  }
}
