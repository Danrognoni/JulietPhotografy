import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <footer id="contacto" class="border-t border-purple-900/40 bg-[#090312] pt-16 pb-12 relative overflow-hidden">
      
      <!-- Subtle ambient glow in footer -->
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <!-- Column 1: Brand & Philosophy -->
          <div class="md:col-span-2 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 p-[1px]">
                <div class="w-full h-full bg-[#0d051c] rounded-[11px] flex items-center justify-center">
                  <svg class="w-4 h-4 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="14.31" y1="8" x2="20.05" y2="17.94"/>
                    <line x1="9.69" y1="8" x2="21.17" y2="8"/>
                    <line x1="7.38" y1="12" x2="13.12" y2="21.94"/>
                    <line x1="9.69" y1="16" x2="3.95" y2="6.06"/>
                    <line x1="14.31" y1="16" x2="2.83" y2="16"/>
                    <line x1="16.62" y1="12" x2="10.88" y2="2.06"/>
                  </svg>
                </div>
              </div>
              <span class="font-display font-bold text-xl tracking-wider text-white">
                JULIET <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 font-light">STUDIO</span>
              </span>
            </div>
            
            <p class="text-purple-300/70 text-sm max-w-md font-light leading-relaxed">
              Estudio de fotografía de autor enfocado en la contemplación de la naturaleza salvaje y la precisión visual en fotografía de producto comercial de alta gama.
            </p>

            <div class="pt-2 text-xs text-purple-400/80 space-y-1">
              <p>📍 Estudio Central: Madrid & Barcelona · Envíos Internacionales</p>
              <p>✉️ Contacto: <a href="mailto:hola&#64;julietphotography.com" class="text-fuchsia-400 hover:underline">hola&#64;julietphotography.com</a></p>
            </div>
          </div>

          <!-- Column 2: Navigation Links -->
          <div>
            <h4 class="font-display font-semibold text-sm uppercase tracking-wider text-white mb-4">
              Explorar
            </h4>
            <ul class="space-y-2.5 text-xs text-purple-300/70">
              <li><a href="#inicio" class="hover:text-fuchsia-300 transition-colors">Inicio & Presentación</a></li>
              <li><a href="#galeria" class="hover:text-fuchsia-300 transition-colors">Paisajes Naturales</a></li>
              <li><a href="#galeria" class="hover:text-fuchsia-300 transition-colors">Fotografía de Producto</a></li>
              <li><a href="#galeria" class="hover:text-fuchsia-300 transition-colors">Ediciones Limitadas</a></li>
              <li><a href="#contacto" class="hover:text-fuchsia-300 transition-colors">Certificados de Autenticidad</a></li>
            </ul>
          </div>

          <!-- Column 3: Newsletter for Collectors -->
          <div>
            <h4 class="font-display font-semibold text-sm uppercase tracking-wider text-white mb-4">
              Club de Coleccionistas
            </h4>
            <p class="text-xs text-purple-300/70 mb-3 font-light">
              Recibe avisos prioritarios de nuevas series limitadas y lanzamientos exclusivos.
            </p>

            @if (newsletterSubscribed()) {
              <div class="p-3 rounded-xl bg-purple-950/60 border border-purple-600/40 text-xs text-fuchsia-300 animate-fadeIn">
                ¡Gracias por suscribirte al club de arte!
              </div>
            } @else {
              <form (ngSubmit)="subscribeNewsletter()" class="space-y-2">
                <input
                  type="email"
                  required
                  [(ngModel)]="email"
                  name="email"
                  placeholder="tu&#64;email.com"
                  class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#140828] border border-purple-800/50 text-white placeholder-purple-400/40 focus:outline-none focus:border-fuchsia-400"/>
                
                <button
                  type="submit"
                  class="w-full btn-neon-violet py-2 rounded-xl text-xs font-bold tracking-wider uppercase">
                  Unirse al Club
                </button>
              </form>
            }
          </div>

        </div>

        <!-- Bottom bar -->
        <div class="pt-8 border-t border-purple-900/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-400/60">
          <p>© 2026 Juliet Photography Studio. Todos los derechos reservados.</p>
          <div class="flex items-center gap-6">
            <span class="hover:text-purple-300 cursor-pointer transition-colors">Términos de Licencia</span>
            <span class="hover:text-purple-300 cursor-pointer transition-colors">Política de Privacidad</span>
            <span class="hover:text-purple-300 cursor-pointer transition-colors">Garantía Fine Art</span>
          </div>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {
  email = '';
  readonly newsletterSubscribed = signal<boolean>(false);

  subscribeNewsletter(): void {
    if (this.email.trim()) {
      this.newsletterSubscribed.set(true);
      this.email = '';
    }
  }
}
