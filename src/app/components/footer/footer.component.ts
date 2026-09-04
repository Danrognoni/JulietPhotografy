import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer id="contacto" class="border-t border-slate-200/80 bg-white/90 backdrop-blur-md pt-16 pb-12 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Contact Highlight Section with WhatsApp & Instagram Cards -->
        <div class="mb-14 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-teal-50/70 via-sky-50/50 to-pink-50/30 border border-teal-200/70 shadow-xs">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div class="space-y-3">
              <span class="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
                Contacto Directo
              </span>
              <h3 class="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                ¿Planeando tu próximo evento o sesión?
              </h3>
              <p class="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                Conversemos sobre tu fecha, ideas y expectativas. Estoy a tu disposición para asesorarte y coordinar una cita previa.
              </p>
            </div>

            <!-- Very Visible Contact Badges: WhatsApp, Instagram & Email -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <!-- WhatsApp Card -->
              <a
                [href]="shop.defaultWhatsAppUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all group">
                <div class="flex flex-col items-center text-center gap-2">
                  <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/>
                    </svg>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">WhatsApp</span>
                    <span class="text-xs font-bold text-slate-900 group-hover:text-emerald-700 font-mono block">2281311917</span>
                  </div>
                </div>
              </a>

              <!-- Instagram Card -->
              <a
                [href]="shop.defaultInstagramUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-pink-300 transition-all group">
                <div class="flex flex-col items-center text-center gap-2">
                  <div class="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors flex items-center justify-center">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Instagram</span>
                    <span class="text-xs font-bold text-slate-900 group-hover:text-pink-700 block">&#64;julietamph_</span>
                  </div>
                </div>
              </a>

              <!-- Email Card -->
              <a
                href="mailto:julietamarateo4@gmail.com"
                class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition-all group">
                <div class="flex flex-col items-center text-center gap-2">
                  <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors flex items-center justify-center">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Correo</span>
                    <span class="text-[11px] font-bold text-slate-900 group-hover:text-sky-700 truncate block">julietamarateo4&#64;...</span>
                  </div>
                </div>
              </a>

            </div>

          </div>
        </div>

        <!-- Main Footer Columns -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <!-- Column 1: Identity -->
          <div class="md:col-span-2 space-y-3">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                JM
              </div>
              <span class="font-display font-bold text-lg text-slate-900">
                Julieta Marateo
              </span>
            </div>
            <p class="text-slate-600 text-sm max-w-md font-normal leading-relaxed">
              Técnica en Fotografía profesional radicada en <strong>Mar del Plata</strong>. Coberturas para casamientos, cumpleaños de XV, eventos y fotografía de producto con máxima dedicación en toma y postproducción.
            </p>
          </div>

          <!-- Column 2: Secciones -->
          <div>
            <h4 class="font-display font-semibold text-xs uppercase tracking-wider text-slate-900 mb-3">
              Navegación
            </h4>
            <ul class="space-y-2 text-xs text-slate-600">
              <li><a href="#inicio" class="hover:text-teal-700 transition-colors">Inicio</a></li>
              <li><a href="#fotos" class="hover:text-teal-700 transition-colors">Fotos & Portafolio</a></li>
              <li><a href="#servicios" class="hover:text-teal-700 transition-colors">Servicios de Cobertura</a></li>
              <li><a href="#sobre-mi" class="hover:text-teal-700 transition-colors">Sobre mí</a></li>
              <li><a href="#contacto" class="hover:text-teal-700 transition-colors">Contacto</a></li>
            </ul>
          </div>

          <!-- Column 3: Contacto y Redes -->
          <div>
            <h4 class="font-display font-semibold text-xs uppercase tracking-wider text-slate-900 mb-3">
              Datos Profesionales
            </h4>
            <ul class="space-y-2 text-xs text-slate-600">
              <li>📍 <strong>Ubicación:</strong> Mar del Plata, Argentina</li>
              <li>📱 <strong>WhatsApp:</strong> <a [href]="shop.defaultWhatsAppUrl" target="_blank" class="text-teal-700 hover:underline">2281311917</a></li>
              <li>📷 <strong>Instagram:</strong> <a [href]="shop.defaultInstagramUrl" target="_blank" class="text-pink-600 hover:underline font-semibold">&#64;julietamph_</a></li>
              <li>✉️ <strong>Correo:</strong> <a href="mailto:julietamarateo4@gmail.com" class="text-teal-700 hover:underline">julietamarateo4&#64;gmail.com</a></li>
            </ul>
          </div>

        </div>

        <!-- Bottom Copyright & Hidden Login Link -->
        <div class="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 Julieta Marateo · Técnica en Fotografía. Mar del Plata. Todos los derechos reservados.</p>
          
          <div class="flex items-center gap-4">
            @if (auth.isAdmin()) {
              <button (click)="shop.openAdminDashboard('photos')" class="text-teal-700 hover:underline font-semibold">
                Abrir Panel CRUD
              </button>
              <button (click)="auth.logout()" class="text-red-500 hover:underline">
                Cerrar Sesión
              </button>
            } @else {
              <!-- Hidden route /login link discreetly accessible for administrator -->
              <a routerLink="/login" class="text-slate-400/80 hover:text-slate-600 transition-colors text-[11px]">
                Acceso Admin
              </a>
            }
          </div>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {
  readonly shop = inject(ShopService);
  readonly auth = inject(AuthService);
}
