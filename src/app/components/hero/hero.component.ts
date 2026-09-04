import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="inicio" class="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      
      <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Main Presentation Container: Profile Photo + Bio Card -->
        <div id="sobre-mi" class="card-fresh rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 bg-white/90 backdrop-blur-md relative group">
          
          <!-- Admin Quick Edit Profile Badge (VISIBLE ONLY IF LOGGED IN) -->
          @if (auth.isAdmin()) {
            <button
              (click)="shop.openAdminDashboard('profile')"
              title="Editar foto y biografía de perfil"
              class="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-300 text-teal-800 text-xs font-bold hover:bg-teal-100 flex items-center gap-1.5 shadow-xs transition-colors">
              <svg class="w-3.5 h-3.5 text-teal-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>Editar Perfil</span>
            </button>
          }

          <!-- Profile Picture with persistent imageUrl from shop.profile() -->
          <div class="relative flex-shrink-0 group/img">
            <div class="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl p-2 bg-gradient-to-tr from-teal-400 via-sky-300 to-yellow-200 shadow-md">
              <div class="w-full h-full rounded-[20px] overflow-hidden bg-slate-100 relative">
                <img
                  [src]="shop.profile().imageUrl"
                  [alt]="shop.profile().name + ' - ' + shop.profile().title"
                  class="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"/>
              </div>
            </div>
            
            <!-- Location Badge -->
            <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-white text-teal-800 border border-teal-200 text-xs font-semibold shadow-xs flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>{{ shop.profile().location }}</span>
            </div>
          </div>

          <!-- Bio & Introduction Text from persistent shop.profile() -->
          <div class="flex-grow text-center lg:text-left space-y-5">
            
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>{{ shop.profile().title }}</span>
              </span>

              <!-- Instagram Badge -->
              <a
                [href]="shop.defaultInstagramUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-semibold hover:bg-pink-100 transition-colors">
                <svg class="w-3.5 h-3.5 text-pink-600 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>{{ shop.profile().instagram }}</span>
              </a>
            </div>

            <!-- Introductory Presentation text -->
            <p class="text-base sm:text-lg lg:text-xl text-slate-700 font-normal leading-relaxed">
              {{ shop.profile().bio }}
            </p>

            <!-- Key Specialties Pills -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span class="px-3 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-100 text-xs font-medium">
                💍 Casamientos
              </span>
              <span class="px-3 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-100 text-xs font-medium">
                👑 Cumpleaños de XV
              </span>
              <span class="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium">
                🎉 Eventos Sociales & Corporativos
              </span>
              <span class="px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-100 text-xs font-medium">
                ✨ Retoque & Postproducción
              </span>
            </div>

            <!-- Quick Action Buttons -->
            <div class="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
              <a href="#servicios"
                 class="btn-fresh-gradient px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                <span>Ver Servicios</span>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>

              <a [href]="shop.defaultWhatsAppUrl"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="btn-whatsapp px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/>
                </svg>
                <span>Agendar Cita</span>
              </a>

              <a [href]="shop.defaultInstagramUrl"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="btn-instagram px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
            </div>

          </div>

        </div>

      </div>

    </section>
  `
})
export class HeroComponent {
  readonly shop = inject(ShopService);
  readonly auth = inject(AuthService);
}
