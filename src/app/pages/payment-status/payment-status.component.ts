import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ShopService, OrderResult } from '../../services/shop.service';

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-aura-mesh text-[#86DEB7] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      
      <!-- Top Brand Anchor -->
      <header class="max-w-3xl mx-auto w-full flex items-center justify-between pb-8 border-b border-[#63B995]/30">
        <a 
          routerLink="/" 
          class="flex items-center gap-3 text-[#86DEB7] hover:text-white transition-colors group">
          <div class="w-10 h-10 rounded-xl bg-[#63B995] border border-[#86DEB7] text-[#142417] flex items-center justify-center font-bold font-editorial text-lg group-hover:scale-105 transition-transform">
            JM
          </div>
          <div>
            <span class="font-editorial text-xl font-bold tracking-wide block">Julieta Marateo</span>
            <span class="text-[10px] tracking-widest uppercase text-[#86DEB7]/70 block font-sans">Fotografía Profesional</span>
          </div>
        </a>

        <a 
          routerLink="/" 
          class="text-xs font-semibold text-[#86DEB7] hover:text-white flex items-center gap-1.5 transition-colors">
          <span>Volver al Portafolio</span>
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>
      </header>

      <!-- Main Result Presentation Card -->
      <main class="max-w-2xl mx-auto w-full my-auto py-8">
        
        @if (isLoading()) {
          <!-- Skeleton Loading de Hidratación SSR -->
          <div class="p-8 sm:p-12 rounded-3xl bg-[#142417]/90 border border-[#86DEB7]/50 shadow-2xl backdrop-blur-md text-center space-y-6 animate-pulse">
            <div class="w-20 h-20 rounded-full bg-[#63B995]/30 mx-auto"></div>
            <div class="h-8 bg-[#63B995]/30 rounded-lg max-w-sm mx-auto"></div>
            <div class="h-4 bg-[#63B995]/20 rounded max-w-xs mx-auto"></div>
          </div>
        } @else if (statusNormalized() === 'approved') {
          
          <!-- ESTADO 1: PAGO APROBADO (ÉXITO) -->
          <div class="p-6 sm:p-10 rounded-3xl bg-[#142417]/95 border border-[#86DEB7] shadow-2xl shadow-[#63B995]/15 backdrop-blur-md text-center space-y-6 animate-fadeIn">
            
            <!-- Badge superior -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#63B995]/20 border border-[#86DEB7] text-[#86DEB7] text-xs font-semibold">
              <span class="w-2 h-2 rounded-full bg-[#86DEB7] animate-ping"></span>
              <span>Transacción Aprobada</span>
            </div>

            <!-- Ícono de Éxito Circular -->
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#63B995] text-[#142417] flex items-center justify-center mx-auto shadow-xl shadow-[#86DEB7]/30 border-2 border-[#86DEB7] transform hover:scale-105 transition-transform">
              <svg class="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>

            <!-- Títulos Editoriales -->
            <div class="space-y-2">
              <h1 class="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#86DEB7]">
                ¡Tu adquisición está confirmada!
              </h1>
              <p class="text-xs sm:text-sm text-[#86DEB7]/90 max-w-md mx-auto leading-relaxed">
                El pago fue acreditado correctamente a través de Mercado Pago. Julieta ya está preparando el pedido para su entrega o coordinación en Mar del Plata.
              </p>
            </div>

            <!-- Ficha de Datos de la Transacción -->
            <div class="p-4 sm:p-5 rounded-2xl bg-[#63B995]/15 border border-[#86DEB7]/60 text-left space-y-2.5 text-xs">
              <div class="flex justify-between items-center py-1 border-b border-[#63B995]/30">
                <span class="text-[#86DEB7]/70 font-medium">Nº de Pedido:</span>
                <span class="font-mono font-bold text-[#86DEB7]">{{ orderId() || 'Confirmado' }}</span>
              </div>
              @if (paymentId()) {
                <div class="flex justify-between items-center py-1 border-b border-[#63B995]/30">
                  <span class="text-[#86DEB7]/70 font-medium">ID de Transacción MP:</span>
                  <span class="font-mono font-semibold text-[#86DEB7]">{{ paymentId() }}</span>
                </div>
              }
              @if (verifiedOrder()) {
                <div class="flex justify-between items-center py-1 border-b border-[#63B995]/30">
                  <span class="text-[#86DEB7]/70 font-medium">Titular del Pedido:</span>
                  <span class="font-semibold text-[#86DEB7]">{{ verifiedOrder()?.customerName }}</span>
                </div>
                <div class="flex justify-between items-center py-1 border-b border-[#63B995]/30">
                  <span class="text-[#86DEB7]/70 font-medium">Total de Obras:</span>
                  <span class="font-semibold text-[#86DEB7]">{{ verifiedOrder()?.totalItems }} obra(s)</span>
                </div>
                <div class="flex justify-between items-center py-1">
                  <span class="text-[#86DEB7]/70 font-medium">Monto Total Abonado:</span>
                  <span class="font-bold text-sm text-[#86DEB7]">\${{ verifiedOrder()?.total }} USD</span>
                </div>
              }
            </div>

            <!-- Acciones -->
            <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a 
                routerLink="/"
                class="w-full sm:w-auto btn-editorial-mint px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-center">
                Explorar Más Obras
              </a>

              <a 
                [href]="getWhatsAppSupportLink()"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full sm:w-auto btn-aura-outline px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                <svg class="w-4 h-4 text-[#86DEB7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <span>Avisar por WhatsApp</span>
              </a>
            </div>

          </div>

        } @else if (statusNormalized() === 'pending' || statusNormalized() === 'in_process') {
          
          <!-- ESTADO 2: PAGO PENDIENTE / EN PROCESO -->
          <div class="p-6 sm:p-10 rounded-3xl bg-[#142417]/95 border border-amber-400/80 shadow-2xl shadow-amber-500/10 backdrop-blur-md text-center space-y-6 animate-fadeIn">
            
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-semibold">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Acreditación en Proceso</span>
            </div>

            <!-- Ícono Ámbar -->
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-400 text-[#142417] flex items-center justify-center mx-auto shadow-xl shadow-amber-400/30 border-2 border-amber-300">
              <svg class="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>

            <div class="space-y-2">
              <h1 class="font-editorial text-3xl sm:text-4xl font-bold text-amber-300">
                Tu pago está siendo procesado
              </h1>
              <p class="text-xs sm:text-sm text-amber-100/90 max-w-md mx-auto leading-relaxed">
                Mercado Pago está validando la transacción. En cuanto se acredite, recibirás la confirmación y te contactaremos para entregarte tu obra.
              </p>
            </div>

            <!-- Detalles de referencia -->
            <div class="p-4 rounded-2xl bg-amber-950/30 border border-amber-400/40 text-left space-y-2 text-xs text-amber-200">
              @if (orderId()) {
                <div class="flex justify-between items-center py-1">
                  <span class="text-amber-200/70 font-medium">Nº de Referencia de Orden:</span>
                  <span class="font-mono font-bold text-amber-300">{{ orderId() }}</span>
                </div>
              }
              @if (paymentId()) {
                <div class="flex justify-between items-center py-1 border-t border-amber-400/20">
                  <span class="text-amber-200/70 font-medium">ID de Operación MP:</span>
                  <span class="font-mono font-bold text-amber-300">{{ paymentId() }}</span>
                </div>
              }
              <p class="text-[11px] text-amber-200/70 pt-1">
                ℹ️ Si pagaste mediante cupón de pago o transferencia, la acreditación puede tomar entre 1 y 2 horas hábiles.
              </p>
            </div>

            <!-- Acciones -->
            <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a 
                routerLink="/"
                class="w-full sm:w-auto btn-editorial-mint px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-center">
                Volver a la Galería
              </a>

              <a 
                [href]="getWhatsAppSupportLink()"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full sm:w-auto btn-aura-outline px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                <span>Consultar por WhatsApp</span>
              </a>
            </div>

          </div>

        } @else {
          
          <!-- ESTADO 3: PAGO RECHAZADO / CANCELADO / ERROR -->
          <div class="p-6 sm:p-10 rounded-3xl bg-[#142417]/95 border border-red-500/80 shadow-2xl shadow-red-500/10 backdrop-blur-md text-center space-y-6 animate-fadeIn">
            
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/20 border border-red-400 text-red-300 text-xs font-semibold">
              <span>Pago no completado</span>
            </div>

            <!-- Ícono Rojo de Alerta -->
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-red-500/30 border-2 border-red-400">
              <svg class="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>

            <div class="space-y-2">
              <h1 class="font-editorial text-3xl sm:text-4xl font-bold text-red-300">
                El pago no pudo procesarse
              </h1>
              <p class="text-xs sm:text-sm text-red-200/90 max-w-md mx-auto leading-relaxed">
                La entidad bancaria o Mercado Pago no autorizó la operación. No te preocupes: <strong>no se ha efectuado ningún cobro en tu cuenta</strong> y tus fotografías siguen guardadas en tu carrito.
              </p>
            </div>

            <!-- Detalles de referencia -->
            @if (orderId() || paymentId()) {
              <div class="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-left space-y-1.5 text-xs text-red-200">
                @if (orderId()) {
                  <div class="flex justify-between items-center">
                    <span class="text-red-200/70">Nº de Orden:</span>
                    <span class="font-mono font-bold">{{ orderId() }}</span>
                  </div>
                }
                @if (paymentId()) {
                  <div class="flex justify-between items-center">
                    <span class="text-red-200/70">ID de Transacción:</span>
                    <span class="font-mono">{{ paymentId() }}</span>
                  </div>
                }
              </div>
            }

            <!-- Acciones -->
            <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button 
                type="button"
                (click)="retryCheckout()"
                class="w-full sm:w-auto bg-[#009EE3] hover:bg-[#0081bb] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#009EE3]/30 transition-all">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 4v6h6"/>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
                <span>Reintentar Pago en Carrito</span>
              </button>

              <a 
                routerLink="/"
                class="w-full sm:w-auto btn-aura-outline px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-center">
                Volver al Inicio
              </a>
            </div>

          </div>

        }

      </main>

      <!-- Footer Minimalista -->
      <footer class="max-w-3xl mx-auto w-full text-center pt-8 border-t border-[#63B995]/20 text-xs text-[#86DEB7]/60">
        <p>© 2026 Juliet Photography · Fotografía de autor y servicios profesionales · Mar del Plata, Argentina</p>
      </footer>

    </div>
  `
})
export class PaymentStatusComponent implements OnInit {
  readonly shop = inject(ShopService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  // Señales de Estado
  readonly isLoading = signal<boolean>(true);
  readonly statusNormalized = signal<'approved' | 'pending' | 'in_process' | 'rejected' | 'failure' | 'unknown'>('unknown');
  readonly orderId = signal<string | null>(null);
  readonly paymentId = signal<string | null>(null);
  readonly preferenceId = signal<string | null>(null);
  readonly verifiedOrder = signal<OrderResult | null>(null);

  ngOnInit(): void {
    // Si estamos en el navegador, leer query params y ejecutar la lógica
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParams.subscribe((params) => {
        const rawStatus = (params['collection_status'] || params['status'] || '').toLowerCase();
        const pId = params['payment_id'] || params['collection_id'] || null;
        const oId = params['external_reference'] || null;
        const prefId = params['preference_id'] || null;

        this.paymentId.set(pId);
        this.orderId.set(oId);
        this.preferenceId.set(prefId);

        let resolvedStatus: 'approved' | 'pending' | 'in_process' | 'rejected' | 'failure' | 'unknown' = 'unknown';

        if (rawStatus === 'approved') {
          resolvedStatus = 'approved';
        } else if (rawStatus === 'pending') {
          resolvedStatus = 'pending';
        } else if (rawStatus === 'in_process') {
          resolvedStatus = 'in_process';
        } else if (rawStatus === 'rejected' || rawStatus === 'failure' || rawStatus === 'cancelled') {
          resolvedStatus = 'rejected';
        } else if (rawStatus) {
          resolvedStatus = 'rejected';
        }

        this.statusNormalized.set(resolvedStatus);
        this.isLoading.set(false);

        // Si el estado es aprobado: vaciar el carrito y consultar backend
        if (resolvedStatus === 'approved') {
          this.shop.clearCart();

          if (oId) {
            this.shop.verifyOrderStatus(oId).subscribe({
              next: (order) => this.verifiedOrder.set(order),
              error: (err) => console.info('No se pudo verificar la orden en backend (puede estar procesando):', err?.status)
            });
          }
        }
      });
    } else {
      // En SSR inicializar carga
      this.isLoading.set(false);
    }
  }

  retryCheckout(): void {
    this.router.navigate(['/']).then(() => {
      this.shop.openCart();
    });
  }

  getWhatsAppSupportLink(): string {
    const orderNumber = this.orderId() || 'Sin número';
    const statusText = this.statusNormalized() === 'approved' ? 'aprobado' : 'con dudas en el pago';
    const msg = `Hola Julieta! Vengo de tu web. Tengo una consulta sobre mi pedido (${orderNumber}) cuyo estado es ${statusText}.`;
    return `https://wa.me/5492281311917?text=${encodeURIComponent(msg)}`;
  }
}
