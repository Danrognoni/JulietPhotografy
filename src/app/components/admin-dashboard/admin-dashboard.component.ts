import { Component, inject, signal, effect, HostListener, ViewChild, ElementRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';
import { ViewportScrollService } from '../../services/viewport-scroll.service';
import { Photo, PhotoCategory, ServiceItem, ProfileData, AlbumFolder } from '../../models/photo.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (shop.isAdminDashboardOpen()) {
      <!-- Backdrop con cierre por clic exterior para evitar pantallas trabadas -->
      <div 
        (click)="onBackdropClick($event)"
        class="modal-overlay-viewport fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 backdrop-blur-md bg-black/75 animate-fadeIn">
        
        <!-- Modal Card Dashboard (detiene propagación de clic) -->
        <div 
          #dashboardModalCard
          (click)="$event.stopPropagation()"
          class="relative w-full max-w-5xl bg-[#13082a] border border-violet-500/30 rounded-3xl shadow-2xl shadow-violet-950/80 overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
          
          <!-- Header Bar -->
          <div #dashboardHeader class="px-6 py-5 border-b border-violet-500/20 bg-[#180b36] flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/30">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="18" x="3" y="3" rx="2"/>
                  <path d="M7 7h10M7 12h10M7 17h10"/>
                </svg>
              </div>
              <div>
                <h3 class="font-display font-bold text-xl text-white">Panel de Control Administradora</h3>
                <p class="text-xs text-violet-300/80">Sesión activa como: <strong class="text-fuchsia-300">{{ auth.currentUser()?.email }}</strong></p>
              </div>
            </div>

            <!-- Close Button -->
            <button
              type="button"
              (click)="shop.closeAdminDashboard()"
              aria-label="Cerrar panel de administración"
              class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-violet-900/40 transition-colors">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Tab Bar Navigation: Fotos vs Álbumes vs Servicios vs Editar Perfil (Sincronizado con URL) -->
          <div class="px-6 pt-4 border-b border-violet-500/20 bg-[#13082b] flex items-center gap-4 overflow-x-auto">
            <button
              type="button"
              (click)="switchTab('photos')"
              class="pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap"
              [ngClass]="activeTab() === 'photos' ? 'border-[#86DEB7] text-[#86DEB7]' : 'border-transparent text-slate-400 hover:text-white'">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <span>Fotos ({{ shop.photos().length }})</span>
            </button>

            <button
              type="button"
              (click)="switchTab('albums')"
              class="pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap"
              [ngClass]="activeTab() === 'albums' ? 'border-[#86DEB7] text-[#86DEB7]' : 'border-transparent text-slate-400 hover:text-white'">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
              </svg>
              <span>Álbumes Temáticos ({{ shop.albumFolders().length }})</span>
            </button>

            <button
              type="button"
              (click)="switchTab('services')"
              class="pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap"
              [ngClass]="activeTab() === 'services' ? 'border-[#86DEB7] text-[#86DEB7]' : 'border-transparent text-slate-400 hover:text-white'">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Servicios ({{ shop.services().length }})</span>
            </button>

            <button
              type="button"
              (click)="switchTab('profile')"
              class="pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap"
              [ngClass]="activeTab() === 'profile' ? 'border-violet-400 text-violet-300' : 'border-transparent text-slate-400 hover:text-white'">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Editar Perfil & Sobre Mí</span>
            </button>
          </div>

          <!-- Body Content Area -->
          <div #scrollContainer class="p-6 overflow-y-auto flex-grow space-y-8 bg-[#0c051a]">

            <!-- TAB 1: GESTIÓN DE FOTOS -->
            @if (activeTab() === 'photos') {
              
              <!-- Photo Form (Create / Edit) -->
              <div class="p-6 rounded-2xl bg-[#160b33]/80 border border-violet-500/25 shadow-xl space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="font-display font-bold text-base text-white flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-fuchsia-400"></span>
                    <span>{{ editingPhotoId() ? 'Editar Fotografía' : 'Subir Nueva Fotografía' }}</span>
                  </h4>
                  @if (editingPhotoId()) {
                    <button
                      type="button"
                      (click)="cancelPhotoEdit()"
                      class="text-xs text-violet-300 hover:text-white underline">
                      Cancelar edición
                    </button>
                  }
                </div>

                <form (ngSubmit)="savePhoto()" class="space-y-4">
                  
                  <!-- Drag & Drop / Image URL input -->
                  <div class="space-y-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-violet-300">
                      Imagen de la Fotografía *
                    </label>

                    <div
                      (dragover)="onDragOver($event)"
                      (dragleave)="onDragLeave($event)"
                      (drop)="onDropPhoto($event)"
                      (click)="photoFileInput.click()"
                      class="drag-drop-zone-fresh rounded-xl p-4 text-center cursor-pointer relative overflow-hidden transition-all">
                      <input
                        #photoFileInput
                        type="file"
                        accept="image/*"
                        (change)="onPhotoFileSelected($event)"
                        class="hidden"/>

                      @if (photoImageUrl) {
                        <div class="flex items-center justify-center gap-3">
                          <img [src]="photoImageUrl" alt="Vista previa" loading="lazy" decoding="async" class="h-20 w-28 object-cover rounded-lg border border-violet-500/40 shadow-xs"/>
                          <div class="text-left text-xs">
                            <span class="font-semibold text-white block">Imagen lista</span>
                            <span class="text-fuchsia-400 hover:underline">Haz clic o arrastra para cambiar</span>
                          </div>
                        </div>
                      } @else {
                        <div class="flex items-center justify-center gap-2 text-xs text-violet-300">
                          <svg class="w-5 h-5 text-fuchsia-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                            <path d="M12 12v9"/>
                            <path d="m16 16-4-4-4 4"/>
                          </svg>
                          <span>Arrastra tu foto aquí o <strong>haz clic para examinar</strong></span>
                        </div>
                      }
                    </div>

                    <input
                      type="url"
                      [(ngModel)]="photoImageUrl"
                      name="photoImageUrl"
                      placeholder="O pega una URL: https://images.unsplash.com/..."
                      class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0e0620] border border-violet-600/40 text-white placeholder-violet-300/40 focus:outline-none focus:border-fuchsia-400"/>
                  </div>

                  <!-- Title, Category, Price -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                        Título de la Obra *
                      </label>
                      <input
                        type="text"
                        required
                        [(ngModel)]="photoTitle"
                        name="photoTitle"
                        placeholder="Ej: Calma en Acantilados"
                        class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0e0620] border border-violet-600/40 text-white placeholder-violet-300/40 focus:outline-none focus:border-fuchsia-400"/>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
                        Carpeta / Categoría del Álbum *
                      </label>
                      <div class="space-y-2">
                        <select
                          [(ngModel)]="photoCategory"
                          name="photoCategory"
                          (ngModelChange)="onCategorySelectChange($event)"
                          class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0e0620] border border-violet-600/40 text-white focus:outline-none focus:border-[#86DEB7]">
                          @for (cat of shop.albumCategories(); track cat) {
                            <option [value]="cat">{{ cat }}</option>
                          }
                          <option value="__NEW_CATEGORY__">+ Crear o ingresar nuevo álbum...</option>
                        </select>

                        @if (isCreatingNewCategory()) {
                          <div class="flex items-center gap-2 animate-fadeIn">
                            <input
                              type="text"
                              [(ngModel)]="newCategoryName"
                              name="newCategoryName"
                              placeholder="Nombre de la nueva carpeta / álbum..."
                              class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0b0518] border border-emerald-400/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-300"/>
                            <button
                              type="button"
                              (click)="applyNewCategory()"
                              class="px-3 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs whitespace-nowrap">
                              Asignar
                            </button>
                          </div>
                        }
                      </div>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                        Precio (USD) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        [(ngModel)]="photoPrice"
                        name="photoPrice"
                        class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0e0620] border border-violet-600/40 text-white focus:outline-none focus:border-fuchsia-400"/>
                    </div>
                  </div>

                  <!-- Mandatory Technical Sheet -->
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                      Ficha Técnica Completa (Obligatoria) *
                    </label>
                    <input
                      type="text"
                      required
                      [(ngModel)]="photoTechnicalSheet"
                      name="photoTechnicalSheet"
                      placeholder="Ej: Sony Alpha 7 IV · 85mm f/1.4 GM · 1/800s · f/1.8 · ISO 100"
                      class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0e0620] border border-violet-600/40 text-white placeholder-violet-300/40 focus:outline-none focus:border-fuchsia-400 font-mono"/>
                  </div>

                  <!-- Description & Dimensions -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                        Dimensiones / Soporte
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="photoDimensions"
                        name="photoDimensions"
                        placeholder="60 x 40 cm · Fine Art"
                        class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0e0620] border border-violet-600/40 text-white placeholder-violet-300/40 focus:outline-none focus:border-fuchsia-400"/>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                        Breve Descripción Artística
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="photoDescription"
                        name="photoDescription"
                        placeholder="Descripción conceptual de la toma..."
                        class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0e0620] border border-violet-600/40 text-white placeholder-violet-300/40 focus:outline-none focus:border-fuchsia-400"/>
                    </div>
                  </div>

                  <!-- Submit Action -->
                  <div class="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      [disabled]="!isPhotoFormValid() || isSubmitting()"
                      class="btn-fresh-gradient px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      @if (isSubmitting()) {
                        <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle>
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
                        </svg>
                        <span>Guardando...</span>
                      } @else {
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                          <polyline points="17 21 17 13 7 13 7 21"/>
                          <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        <span>{{ editingPhotoId() ? 'Guardar Cambios' : 'Publicar Fotografía' }}</span>
                      }
                    </button>
                  </div>

                </form>
              </div>

              <!-- List of Photos (CRUD List) -->
              <div class="space-y-3">
                <h4 class="font-display font-bold text-base text-white">
                  Catálogo de Obras ({{ shop.photos().length }})
                </h4>

                <div class="rounded-2xl border border-violet-500/25 overflow-hidden bg-[#160b33]/80 shadow-xl">
                  <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                      <thead class="bg-[#1c0e3e] text-violet-300 font-bold uppercase tracking-wider border-b border-violet-500/20">
                        <tr>
                          <th class="p-3.5">Foto</th>
                          <th class="p-3.5">Título</th>
                          <th class="p-3.5">Categoría</th>
                          <th class="p-3.5">Ficha Técnica</th>
                          <th class="p-3.5">Precio</th>
                          <th class="p-3.5 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-violet-900/30">
                        @for (photo of shop.photos(); track photo.id) {
                          <tr class="hover:bg-violet-900/20 transition-colors">
                            <td class="p-3.5">
                              <img [src]="photo.imageUrl" [alt]="photo.title" loading="lazy" decoding="async" class="w-12 h-12 rounded-lg object-cover border border-violet-500/40"/>
                            </td>
                            <td class="p-3.5 font-semibold text-white max-w-[150px] truncate">
                              {{ photo.title }}
                            </td>
                            <td class="p-3.5">
                              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-950 text-violet-300 border border-violet-700/50">
                                {{ photo.category }}
                              </span>
                            </td>
                            <td class="p-3.5 font-mono text-[10.5px] text-violet-300 max-w-[200px] truncate" [title]="photo.technicalSheet">
                              {{ photo.technicalSheet }}
                            </td>
                            <td class="p-3.5 font-bold text-white">
                              \${{ photo.price }} USD
                            </td>
                            <td class="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                type="button"
                                (click)="shop.setHeroCover(photo.id)"
                                [title]="shop.heroPhoto().id === photo.id ? 'Esta fotografía es la Portada Hero actual' : 'Establecer como Portada Hero'"
                                class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border"
                                [ngClass]="shop.heroPhoto().id === photo.id 
                                  ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20' 
                                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:text-emerald-300 hover:border-emerald-500/40'">
                                {{ shop.heroPhoto().id === photo.id ? '★ Portada Hero' : 'Fijar Portada' }}
                              </button>
                              <button
                                type="button"
                                (click)="startPhotoEdit(photo)"
                                title="Editar foto"
                                class="px-2.5 py-1 rounded-lg text-violet-300 bg-violet-900/60 hover:bg-violet-800 border border-violet-600/40 transition-colors">
                                Editar
                              </button>
                              <button
                                type="button"
                                (click)="deletePhoto(photo.id)"
                                title="Eliminar foto"
                                class="px-2.5 py-1 rounded-lg text-rose-400 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 transition-colors">
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            } @else if (activeTab() === 'albums') {
              
              <!-- TAB 2: GESTIÓN DE ÁLBUMES TEMÁTICOS (CRUD COMPLETO) -->
              <div class="space-y-6">
                
                <!-- Album Form (Create / Edit) if active -->
                @if (isCreatingAlbum()) {
                  <div class="p-6 rounded-2xl bg-[#160b33]/80 border border-[#86DEB7]/40 shadow-xl space-y-4 animate-fadeIn">
                    <div class="flex items-center justify-between">
                      <h4 class="font-display font-bold text-base text-white flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#86DEB7]"></span>
                        <span>{{ editingAlbumId() ? 'Editar Álbum Temático' : 'Crear Nuevo Álbum Temático' }}</span>
                      </h4>
                      <button
                        type="button"
                        (click)="cancelAlbumEdit()"
                        class="text-xs text-violet-300 hover:text-white underline">
                        Cancelar
                      </button>
                    </div>

                    <form (ngSubmit)="saveAlbum()" class="space-y-4">
                      
                      <!-- Album Name & Description -->
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1">
                          <label class="block text-xs font-bold uppercase tracking-wider text-violet-300">
                            Nombre del Álbum / Colección *
                          </label>
                          <input
                            type="text"
                            required
                            name="albumName"
                            [(ngModel)]="albumName"
                            placeholder="Ej. Sesiones en Estudio, Retratos de Pareja..."
                            class="w-full px-3.5 py-2 rounded-xl bg-[#0c051a] border border-violet-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#86DEB7] focus:ring-1 focus:ring-[#86DEB7]/30"/>
                        </div>

                        <div class="space-y-1">
                          <label class="block text-xs font-bold uppercase tracking-wider text-violet-300">
                            Descripción Breve
                          </label>
                          <input
                            type="text"
                            name="albumDescription"
                            [(ngModel)]="albumDescription"
                            placeholder="Breve reseña sobre el estilo o locación de la serie..."
                            class="w-full px-3.5 py-2 rounded-xl bg-[#0c051a] border border-violet-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#86DEB7] focus:ring-1 focus:ring-[#86DEB7]/30"/>
                        </div>
                      </div>

                      <!-- Cover Image (Upload or URL or pick from Catalog) -->
                      <div class="space-y-2">
                        <label class="block text-xs font-bold uppercase tracking-wider text-violet-300">
                          Foto de Portada del Álbum
                        </label>

                        <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                          <div class="sm:col-span-8 space-y-2">
                            <input
                              type="url"
                              name="albumCoverUrl"
                              [(ngModel)]="albumCoverUrl"
                              placeholder="https://... o sube una imagen local desde tu PC"
                              class="w-full px-3.5 py-2 rounded-xl bg-[#0c051a] border border-violet-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#86DEB7]"/>

                            <div class="flex items-center gap-3">
                              <label class="cursor-pointer px-3 py-1.5 rounded-xl bg-[#50723C]/30 border border-[#86DEB7]/30 text-[#86DEB7] text-xs font-semibold hover:bg-[#63B995]/40 transition-colors flex items-center gap-2">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                  <polyline points="17 8 12 3 7 8"/>
                                  <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                <span>Subir Portada desde PC</span>
                                <input type="file" accept="image/*" (change)="onAlbumFileSelected($event)" class="hidden"/>
                              </label>

                              @if (selectedAlbumFile) {
                                <span class="text-xs text-[#86DEB7] truncate max-w-[200px]">
                                  {{ selectedAlbumFile.name }}
                                </span>
                              }
                            </div>
                          </div>

                          <!-- Preview Thumbnail -->
                          <div class="sm:col-span-4 flex justify-center sm:justify-end">
                            <div class="w-24 h-24 rounded-xl border border-violet-500/30 overflow-hidden bg-[#0c051a] flex items-center justify-center">
                              @if (albumCoverUrl) {
                                <img [src]="albumCoverUrl" alt="Portada Álbum" class="w-full h-full object-cover"/>
                              } @else {
                                <span class="text-[10px] text-slate-500 text-center p-2">Sin portada asignada</span>
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="flex items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          (click)="cancelAlbumEdit()"
                          class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                          Cancelar
                        </button>

                        <button
                          type="submit"
                          [disabled]="!albumName.trim() || isSubmitting()"
                          class="btn-editorial-mint px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                          @if (isSubmitting()) {
                            <span>Guardando...</span>
                          } @else {
                            <span>{{ editingAlbumId() ? 'Guardar Cambios' : 'Crear Álbum' }}</span>
                          }
                        </button>
                      </div>

                    </form>
                  </div>
                }

                <!-- List of Albums Header & "+ Nuevo Álbum" button -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 class="font-display font-bold text-base text-white">
                      Álbumes Temáticos en Catálogo ({{ shop.albumFolders().length }})
                    </h4>
                    <p class="text-xs text-slate-400 mt-0.5">
                      Gestiona, renombra, agrega portadas y crea colecciones temáticas para la portada y filtros.
                    </p>
                  </div>

                  @if (!isCreatingAlbum()) {
                    <button
                      type="button"
                      (click)="startAlbumCreate()"
                      class="btn-editorial-mint px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md self-start sm:self-auto">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      <span>+ Crear Nuevo Álbum</span>
                    </button>
                  }
                </div>

                <!-- Albums Grid Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  @for (folder of shop.albumFolders(); track folder.id) {
                    <div class="p-4 rounded-2xl bg-[#160b33]/80 border border-violet-500/25 flex flex-col justify-between space-y-3 shadow-md">
                      <div class="flex items-center gap-3">
                        <div class="w-16 h-16 rounded-xl overflow-hidden bg-[#0c051a] flex-shrink-0 border border-violet-500/30">
                          @if (folder.coverImage) {
                            <img [src]="folder.coverImage" [alt]="folder.name" class="w-full h-full object-cover"/>
                          } @else {
                            <div class="w-full h-full flex items-center justify-center text-slate-500 text-[9px] text-center p-1">
                              Sin portada
                            </div>
                          }
                        </div>
                        <div class="min-w-0 flex-grow">
                          <div class="flex items-center justify-between gap-1">
                            <h5 class="font-bold text-white text-sm truncate">{{ folder.name }}</h5>
                            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#50723C]/30 text-[#86DEB7] border border-[#86DEB7]/20 flex-shrink-0">
                              {{ folder.count }} {{ folder.count === 1 ? 'foto' : 'fotos' }}
                            </span>
                          </div>
                          <p class="text-xs text-slate-300/80 line-clamp-2 mt-1">{{ folder.description }}</p>
                        </div>
                      </div>

                      <div class="flex items-center justify-end gap-2 pt-2 border-t border-violet-900/30">
                        <button
                          type="button"
                          (click)="startAlbumEdit(folder)"
                          class="px-3 py-1 rounded-lg text-xs font-semibold text-[#86DEB7] bg-[#50723C]/30 hover:bg-[#63B995]/40 border border-[#86DEB7]/30 transition-colors">
                          Editar
                        </button>
                        <button
                          type="button"
                          (click)="deleteAlbum(folder)"
                          class="px-3 py-1 rounded-lg text-xs font-semibold text-rose-400 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 transition-colors">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  }
                </div>

              </div>

            } @else if (activeTab() === 'services') {
              
              <!-- TAB 2: GESTIÓN DE SERVICIOS -->
              <div class="p-6 rounded-2xl bg-[#160b33]/80 border border-violet-500/25 shadow-xl space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="font-display font-bold text-base text-white flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-fuchsia-400"></span>
                    <span>{{ editingServiceId() ? 'Editar Servicio' : 'Crear Nuevo Servicio de Cobertura' }}</span>
                  </h4>
                  @if (editingServiceId()) {
                    <button
                      type="button"
                      (click)="cancelServiceEdit()"
                      class="text-xs text-violet-300 hover:text-white underline">
                      Cancelar edición
                    </button>
                  }
                </div>

                <form (ngSubmit)="saveService()" class="space-y-4">
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                        Título del Servicio *
                      </label>
                      <input
                        type="text"
                        required
                        [(ngModel)]="serviceTitle"
                        name="serviceTitle"
                        placeholder="Ej: Bautismos & Festejos Familiares"
                        class="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0620] border border-violet-600/40 text-white text-sm focus:outline-none focus:border-fuchsia-400"/>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                        URL de Imagen del Servicio *
                      </label>
                      <input
                        type="url"
                        required
                        [(ngModel)]="serviceImageUrl"
                        name="serviceImageUrl"
                        placeholder="https://images.unsplash.com/..."
                        class="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0620] border border-violet-600/40 text-white text-sm focus:outline-none focus:border-fuchsia-400"/>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                      Descripción del Servicio *
                    </label>
                    <textarea
                      rows="2"
                      required
                      [(ngModel)]="serviceDescription"
                      name="serviceDescription"
                      placeholder="Explica qué incluye la cobertura fotográfica..."
                      class="w-full px-3.5 py-2 rounded-xl bg-[#0e0620] border border-violet-600/40 text-white text-sm focus:outline-none focus:border-fuchsia-400"></textarea>
                  </div>

                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                      Características Principales (separadas por coma)
                    </label>
                    <input
                      type="text"
                      [(ngModel)]="serviceFeaturesString"
                      name="serviceFeaturesString"
                      placeholder="Tomas espontáneas, Galería web privada, Fotos en alta resolución..."
                      class="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0620] border border-violet-600/40 text-white text-sm focus:outline-none focus:border-fuchsia-400"/>
                  </div>

                  <div class="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      [disabled]="!isServiceFormValid() || isSubmitting()"
                      class="btn-fresh-gradient px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      @if (isSubmitting()) {
                        <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle>
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
                        </svg>
                        <span>Guardando...</span>
                      } @else {
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                          <polyline points="17 21 17 13 7 13 7 21"/>
                          <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        <span>{{ editingServiceId() ? 'Guardar Cambios' : 'Crear Servicio' }}</span>
                      }
                    </button>
                  </div>

                </form>
              </div>

              <!-- List of Services (CRUD List) -->
              <div class="space-y-3">
                <h4 class="font-display font-bold text-base text-white">
                  Servicios Publicados ({{ shop.services().length }})
                </h4>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  @for (service of shop.services(); track service.id) {
                    <div class="p-4 rounded-2xl bg-[#160b33]/80 border border-violet-500/25 flex flex-col justify-between space-y-3 shadow-md">
                      <div class="flex items-center gap-3">
                        <img [src]="service.imageUrl" [alt]="service.title" loading="lazy" decoding="async" class="w-14 h-14 rounded-xl object-cover border border-violet-500/30"/>
                        <div class="min-w-0">
                          <h5 class="font-bold text-white text-sm truncate">{{ service.title }}</h5>
                          <p class="text-xs text-slate-300 line-clamp-2 mt-0.5">{{ service.description }}</p>
                        </div>
                      </div>

                      <div class="flex items-center justify-end gap-2 pt-2 border-t border-violet-900/30">
                        <button
                          type="button"
                          (click)="startServiceEdit(service)"
                          class="px-3 py-1 rounded-lg text-xs font-semibold text-violet-300 bg-violet-900/60 hover:bg-violet-800 border border-violet-600/40 transition-colors">
                          Editar
                        </button>
                        <button
                          type="button"
                          (click)="deleteService(service.id)"
                          class="px-3 py-1 rounded-lg text-xs font-semibold text-rose-400 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 transition-colors">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>

            } @else if (activeTab() === 'profile') {
              
              <!-- TAB 3: GESTIÓN DE PERFIL & SOBRE MÍ & ETIQUETAS DINÁMICAS -->
              <div class="p-6 rounded-2xl bg-[#160b33]/80 border border-violet-500/25 shadow-xl space-y-6">
                <div class="flex items-center justify-between">
                  <h4 class="font-display font-bold text-base text-white flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-fuchsia-400"></span>
                    <span>Actualizar Información del Perfil & Presentación</span>
                  </h4>
                  @if (profileSavedMessage()) {
                    <span class="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-fadeIn">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      ¡Guardado con éxito!
                    </span>
                  }
                </div>

                <form (ngSubmit)="saveProfile()" class="space-y-6">
                  
                  <!-- Profile Image Preview & URL / Drag Drop -->
                  <div class="space-y-3">
                    <label class="block text-xs font-bold uppercase tracking-wider text-violet-300">
                      Foto de Perfil Profesional
                    </label>

                    <div class="flex flex-col sm:flex-row items-center gap-5">
                      <!-- Image Preview Avatar -->
                      <div class="w-28 h-28 rounded-2xl overflow-hidden border-2 border-violet-400/50 shadow-lg shadow-violet-950/50 flex-shrink-0 bg-[#0e0620]">
                        <img [src]="profileImageUrl" alt="Vista previa de perfil" loading="lazy" decoding="async" class="w-full h-full object-cover"/>
                      </div>

                      <div class="flex-grow space-y-2 w-full">
                        <!-- File Upload Button & Status -->
                        <div class="flex items-center gap-3">
                          <input
                            #profileFileInput
                            type="file"
                            accept="image/*"
                            (change)="onProfileFileSelected($event)"
                            class="hidden"/>
                          <button
                            type="button"
                            (click)="profileFileInput.click()"
                            class="px-4 py-2 text-xs font-semibold rounded-xl bg-violet-900/60 border border-violet-500/40 text-violet-200 hover:bg-violet-800 hover:text-white transition-colors flex items-center gap-2">
                            <svg class="w-4 h-4 text-fuchsia-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="17 8 12 3 7 8"/>
                              <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            <span>{{ selectedProfileFile ? 'Cambiar archivo seleccionado' : 'Subir imagen desde equipo' }}</span>
                          </button>
                          @if (selectedProfileFile) {
                            <span class="text-xs text-emerald-300 font-medium truncate max-w-[200px] inline-flex items-center gap-1">
                              <svg class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              <span class="truncate">{{ selectedProfileFile.name }}</span>
                            </span>
                          }
                        </div>

                        <input
                          type="url"
                          [(ngModel)]="profileImageUrl"
                          name="profileImageUrl"
                          placeholder="O ingresa una URL: https://images.unsplash.com/..."
                          class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0e0620] border border-violet-600/40 text-white placeholder-violet-300/40 focus:outline-none focus:border-fuchsia-400"/>
                        <p class="text-[11px] text-slate-400">
                          Sube un archivo de imagen o ingresa una URL directa para actualizar tu retrato profesional.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Name, Title, Location -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        required
                        [(ngModel)]="profileName"
                        name="profileName"
                        class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0e0620] border border-violet-600/40 text-white focus:outline-none focus:border-fuchsia-400"/>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                        Título Profesional
                      </label>
                      <input
                        type="text"
                        required
                        [(ngModel)]="profileTitle"
                        name="profileTitle"
                        class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0e0620] border border-violet-600/40 text-white focus:outline-none focus:border-fuchsia-400"/>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        required
                        [(ngModel)]="profileLocation"
                        name="profileLocation"
                        class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0e0620] border border-violet-600/40 text-white focus:outline-none focus:border-fuchsia-400"/>
                    </div>
                  </div>

                  <!-- Bio / Introduction text -->
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                      Texto de Presentación (Sección "Sobre Mí") *
                    </label>
                    <textarea
                      rows="4"
                      required
                      [(ngModel)]="profileBio"
                      name="profileBio"
                      placeholder="Escribe tu presentación profesional..."
                      class="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#0e0620] border border-violet-600/40 text-white focus:outline-none focus:border-fuchsia-400 leading-relaxed"></textarea>
                  </div>

                  <!-- REQUERIMIENTO 2: GESTIÓN DINÁMICA DE ETIQUETAS EN EDITAR PERFIL -->
                  <div class="space-y-3 p-4 rounded-2xl bg-[#0e0620]/80 border border-violet-500/30">
                    <div class="flex items-center justify-between">
                      <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-violet-200">
                          Etiquetas de Especialidades & Servicios (Dinámicas)
                        </label>
                        <p class="text-[11px] text-violet-300/70 mt-0.5">
                          Administra las etiquetas que se mostrarán en la portada ("Sobre Mí"). Puedes agregar, editar o eliminar las que desees.
                        </p>
                      </div>
                      <span class="text-xs text-fuchsia-300 font-semibold px-2 py-0.5 rounded-full bg-fuchsia-950/80 border border-fuchsia-700/40">
                        {{ profileTags().length }} etiquetas
                      </span>
                    </div>

                    <!-- Input para agregar nueva etiqueta -->
                    <div class="flex items-center gap-2">
                      <input
                        type="text"
                        [(ngModel)]="newTagInput"
                        (keydown.enter)="$event.preventDefault(); addTag()"
                        name="newTagInput"
                        placeholder="Escribe una etiqueta (ej: 'Sesiones Boudoir') y presiona Enter o Agregar..."
                        class="flex-grow px-3.5 py-2 text-xs rounded-xl bg-[#140b2e] border border-violet-600/40 text-white placeholder-violet-400/40 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400/30"/>
                      
                      <button
                        type="button"
                        (click)="addTag()"
                        class="btn-fresh-gradient px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        <span>Agregar</span>
                      </button>
                    </div>

                    <!-- Lista de Chips Dinámicos con Edición y Eliminación -->
                    <div class="flex flex-wrap items-center gap-2 pt-2">
                      @for (tag of profileTags(); track $index) {
                        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1d0d40] border border-violet-500/40 text-violet-100 text-xs shadow-md group">
                          @if (editingTagIndex() === $index) {
                            <input
                              type="text"
                              [(ngModel)]="editingTagValue"
                              (keydown.enter)="$event.preventDefault(); saveEditedTag($index)"
                              (keydown.escape)="cancelEditTag()"
                              name="editingTag_{{ $index }}"
                              class="px-2 py-0.5 text-xs rounded bg-[#0e0620] border border-fuchsia-400 text-white focus:outline-none w-36"/>
                            <button
                              type="button"
                              (click)="saveEditedTag($index)"
                              title="Guardar cambio"
                              class="text-emerald-400 hover:text-emerald-300 p-0.5">
                              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </button>
                            <button
                              type="button"
                              (click)="cancelEditTag()"
                              title="Cancelar edición"
                              class="text-slate-400 hover:text-white p-0.5">
                              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          } @else {
                            <span class="font-medium text-white">
                              {{ tag }}
                            </span>
                            
                            <button
                              type="button"
                              (click)="startEditTag($index, tag)"
                              title="Editar texto de etiqueta"
                              class="text-violet-400 hover:text-white transition-colors p-0.5 rounded">
                              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                              </svg>
                            </button>

                            <button
                              type="button"
                              (click)="removeTag($index)"
                              title="Eliminar etiqueta"
                              class="text-rose-400 hover:text-rose-300 transition-colors p-0.5 rounded">
                              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          }
                        </div>
                      }

                      @if (profileTags().length === 0) {
                        <p class="text-xs text-slate-400 italic py-1">
                          No tienes etiquetas registradas. Añade una arriba para mostrarla en tu presentación.
                        </p>
                      }
                    </div>
                  </div>

                  <!-- Social Handles -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                        Instagram
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="profileInstagram"
                        name="profileInstagram"
                        placeholder="@julietamph_"
                        class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0e0620] border border-violet-600/40 text-white focus:outline-none focus:border-fuchsia-400"/>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                        WhatsApp
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="profileWhatsapp"
                        name="profileWhatsapp"
                        placeholder="2281311917"
                        class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0e0620] border border-violet-600/40 text-white focus:outline-none focus:border-fuchsia-400"/>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        [(ngModel)]="profileEmail"
                        name="profileEmail"
                        placeholder="julietamarateo4@gmail.com"
                        class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0e0620] border border-violet-600/40 text-white focus:outline-none focus:border-fuchsia-400"/>
                    </div>
                  </div>

                  <!-- Save Button -->
                  <div class="pt-3 flex justify-end">
                    <button
                      type="submit"
                      [disabled]="isSubmitting()"
                      class="btn-fresh-gradient px-7 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md shadow-violet-600/30 disabled:opacity-50">
                      @if (isSubmitting()) {
                        <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle>
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
                        </svg>
                        <span>Guardando perfil...</span>
                      } @else {
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                          <polyline points="17 21 17 13 7 13 7 21"/>
                          <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        <span>Guardar Perfil Permanentemente</span>
                      }
                    </button>
                  </div>

                </form>
              </div>

            }

          </div>

          <!-- Footer Bar -->
          <div class="px-6 py-4 border-t border-violet-500/20 bg-[#180b36] flex items-center justify-between text-xs text-violet-300/80">
            <span>Los cambios se guardan localmente y se reflejan en tiempo real.</span>
            <button
              type="button"
              (click)="shop.closeAdminDashboard()"
              class="px-4 py-2 rounded-xl bg-violet-900/60 hover:bg-violet-800 text-white font-semibold transition-colors border border-violet-500/30">
              Cerrar Panel
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class AdminDashboardComponent {
  readonly shop = inject(ShopService);
  readonly auth = inject(AuthService);
  readonly viewport = inject(ViewportScrollService);

  @ViewChild('scrollContainer') scrollContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('dashboardModalCard') dashboardModalCard?: ElementRef<HTMLDivElement>;
  @ViewChild('dashboardHeader') dashboardHeader?: ElementRef<HTMLDivElement>;

  readonly activeTab = signal<'photos' | 'albums' | 'services' | 'profile'>('photos');
  readonly isSubmitting = signal<boolean>(false);

  // Album form
  editingAlbumId = signal<string | null>(null);
  albumName = '';
  albumDescription = '';
  albumCoverUrl = '';
  selectedAlbumFile: File | null = null;
  previousAlbumName = '';
  isCreatingAlbum = signal<boolean>(false);

  // Photo form
  editingPhotoId = signal<string | null>(null);
  photoTitle = '';
  photoCategory: PhotoCategory = 'Foto Producto';
  photoPrice = 120;
  photoImageUrl = '';
  photoDimensions = '60 x 40 cm · Fine Art';
  photoTechnicalSheet = '';
  photoDescription = '';
  selectedPhotoFile: File | null = null;
  isCreatingNewCategory = signal<boolean>(false);
  newCategoryName = '';

  readonly customCategoryOptions = computed(() => {
    const standard = ['Casamientos', 'Cumpleaños XV', 'Eventos', 'Paisajismo', 'Foto Producto'];
    const all = this.shop.photos().map(p => p.category).filter(Boolean);
    return Array.from(new Set(all.filter(c => !standard.includes(c) && c !== 'Todos')));
  });

  onCategorySelectChange(val: string): void {
    if (val === '__NEW_CATEGORY__') {
      this.isCreatingNewCategory.set(true);
    } else {
      this.isCreatingNewCategory.set(false);
    }
  }

  applyNewCategory(): void {
    const trimmed = this.newCategoryName.trim();
    if (trimmed) {
      this.shop.addAlbum({ name: trimmed, description: 'Colección temática de autor.' });
      this.photoCategory = trimmed;
      this.isCreatingNewCategory.set(false);
      this.newCategoryName = '';
      this.shop.showAlert('info', `Álbum "${trimmed}" creado y asignado a la fotografía.`);
    }
  }

  // Service form
  editingServiceId = signal<string | null>(null);
  serviceTitle = '';
  serviceImageUrl = '';
  serviceDescription = '';
  serviceFeaturesString = '';

  // Profile form
  profileName = '';
  profileTitle = '';
  profileLocation = '';
  profileImageUrl = '';
  profileBio = '';
  profileInstagram = '';
  profileWhatsapp = '';
  profileEmail = '';
  selectedProfileFile: File | null = null;
  profileSavedMessage = signal<boolean>(false);

  // Dynamic tags state
  profileTags = signal<string[]>([]);
  newTagInput = '';
  editingTagIndex = signal<number | null>(null);
  editingTagValue = '';

  constructor() {
    // Sincronizar apertura del dashboard y resetear la posición del scroll
    effect(() => {
      if (this.shop.isAdminDashboardOpen()) {
        this.resetScroll();
        setTimeout(() => this.resetScroll(), 50);
      }
    });

    // Sync initial tab when triggered
    effect(() => {
      this.activeTab.set(this.shop.adminInitialTab());
    });

    // Populate profile form fields and dynamic tags from shop.profile()
    effect(() => {
      const p = this.shop.profile();
      this.profileName = p.name;
      this.profileTitle = p.title;
      this.profileLocation = p.location;
      this.profileImageUrl = p.imageUrl;
      this.profileBio = p.bio;
      this.profileInstagram = p.instagram;
      this.profileWhatsapp = p.whatsapp;
      this.profileEmail = p.email;
      this.profileTags.set(p.tags ? [...p.tags] : ['Casamientos', 'Cumpleaños de XV', 'Eventos Sociales & Corporativos', 'Retoque & Postproducción']);
    });

    // Escuchar si se seleccionó una foto para editar desde la galería
    effect(() => {
      const ep = this.shop.editingPhoto();
      if (ep) {
        this.startPhotoEdit(ep);
      }
    });

    // Escuchar si se seleccionó un álbum para editar
    effect(() => {
      const ea = this.shop.editingAlbum();
      if (ea) {
        this.activeTab.set('albums');
        this.startAlbumEdit(ea);
      }
    });

    // Escuchar si se seleccionó un servicio para editar desde la sección de servicios
    effect(() => {
      const es = this.shop.editingService();
      if (es) {
        this.startServiceEdit(es);
      }
    });
  }

  /**
   * Resetea el scroll de la ventana y del contenedor interno del modal
   */
  resetScroll(): void {
    this.viewport.scrollToTop(true);
    if (this.scrollContainer?.nativeElement) {
      this.viewport.resetContainerScroll(this.scrollContainer.nativeElement);
    }
    if (this.dashboardHeader?.nativeElement) {
      this.viewport.scrollIntoView(this.dashboardHeader.nativeElement, true);
    }
  }

  // --- NAVEGACIÓN ENTRE PESTAÑAS Y SINCRONIZACIÓN CON ROUTER ---
  switchTab(tab: 'photos' | 'albums' | 'services' | 'profile'): void {
    this.activeTab.set(tab);
    this.shop.openAdminDashboard(tab);
    this.resetScroll();
  }

  // --- CRUD DE ÁLBUMES TEMÁTICOS ---
  startAlbumCreate(): void {
    this.editingAlbumId.set(null);
    this.albumName = '';
    this.albumDescription = '';
    this.albumCoverUrl = '';
    this.selectedAlbumFile = null;
    this.previousAlbumName = '';
    this.isCreatingAlbum.set(true);
    this.resetScroll();
  }

  startAlbumEdit(album: AlbumFolder): void {
    this.editingAlbumId.set(album.id);
    this.albumName = album.name;
    this.albumDescription = album.description || '';
    this.albumCoverUrl = album.coverImage || '';
    this.selectedAlbumFile = null;
    this.previousAlbumName = album.name;
    this.isCreatingAlbum.set(true);
    this.resetScroll();
  }

  cancelAlbumEdit(): void {
    this.editingAlbumId.set(null);
    this.albumName = '';
    this.albumDescription = '';
    this.albumCoverUrl = '';
    this.selectedAlbumFile = null;
    this.previousAlbumName = '';
    this.isCreatingAlbum.set(false);
  }

  onAlbumFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processAlbumFile(input.files[0]);
    }
  }

  processAlbumFile(file: File): void {
    this.selectedAlbumFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.albumCoverUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  saveAlbum(): void {
    const name = this.albumName.trim();
    if (!name) {
      this.shop.showAlert('error', 'El nombre del álbum es obligatorio.');
      return;
    }

    if (this.editingAlbumId()) {
      this.shop.updateAlbum(
        this.editingAlbumId()!,
        {
          name,
          description: this.albumDescription.trim(),
          coverImage: this.albumCoverUrl
        },
        this.previousAlbumName
      );
    } else {
      this.shop.addAlbum({
        name,
        description: this.albumDescription.trim(),
        coverImage: this.albumCoverUrl
      });
    }
    this.isSubmitting.set(false);
    this.cancelAlbumEdit();
  }

  deleteAlbum(folder: AlbumFolder): void {
    if (confirm(`¿Estás segura de que deseas eliminar el álbum "${folder.name}"? Las fotografías no se borrarán, pero dejarán de estar agrupadas bajo este álbum.`)) {
      this.shop.deleteAlbum(folder.id);
    }
  }

  // --- CERRAR MODAL CON TECLA ESCAPE O CLIC EN BACKDROP ---
  @HostListener('window:keydown.escape')
  onEscapePress(): void {
    if (this.shop.isAdminDashboardOpen() && !this.isSubmitting()) {
      this.shop.closeAdminDashboard();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (!this.isSubmitting()) {
      this.shop.closeAdminDashboard();
    }
  }

  // --- DYNAMIC TAGS MANAGEMENT ---
  addTag(): void {
    const trimmed = this.newTagInput.trim();
    if (!trimmed) return;
    if (this.profileTags().includes(trimmed)) {
      this.shop.showAlert('warning', `La etiqueta "${trimmed}" ya existe.`);
      return;
    }
    this.profileTags.update(tags => [...tags, trimmed]);
    this.newTagInput = '';
  }

  startEditTag(index: number, current: string): void {
    this.editingTagIndex.set(index);
    this.editingTagValue = current;
  }

  saveEditedTag(index: number): void {
    const trimmed = this.editingTagValue.trim();
    if (!trimmed) {
      this.cancelEditTag();
      return;
    }
    this.profileTags.update(tags => {
      const copy = [...tags];
      copy[index] = trimmed;
      return copy;
    });
    this.editingTagIndex.set(null);
    this.editingTagValue = '';
  }

  cancelEditTag(): void {
    this.editingTagIndex.set(null);
    this.editingTagValue = '';
  }

  removeTag(index: number): void {
    this.profileTags.update(tags => tags.filter((_, i) => i !== index));
  }

  /**
   * Manejador centralizado de errores:
   */
  private handleRequestError(cleanMsg: string, rawError?: any): void {
    this.isSubmitting.set(false);
    this.shop.closeAdminDashboard();
    console.error('[AdminDashboard] Petición fallida:', cleanMsg, rawError);
    this.shop.showAlert('error', cleanMsg, 8000);
    if (typeof window !== 'undefined') {
      alert(cleanMsg);
    }
  }

  // --- DRAG & DROP PHOTO ---
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDropPhoto(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        this.selectedPhotoFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.photoImageUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onPhotoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        this.selectedPhotoFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.photoImageUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onProfileFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        this.selectedProfileFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.profileImageUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  // --- PHOTO CRUD ---
  isPhotoFormValid(): boolean {
    return this.photoTitle.trim().length > 0 &&
      this.photoPrice > 0 &&
      this.photoTechnicalSheet.trim().length > 0 &&
      this.photoImageUrl.trim().length > 0;
  }

  savePhoto(): void {
    if (!this.isPhotoFormValid() || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const categoryToSave = this.isCreatingNewCategory() && this.newCategoryName.trim()
      ? this.newCategoryName.trim()
      : this.photoCategory;

    if (this.editingPhotoId()) {
      const photoId = this.editingPhotoId()!;
      this.shop.updatePhoto(photoId, {
        title: this.photoTitle.trim(),
        category: categoryToSave,
        price: Number(this.photoPrice),
        imageUrl: this.photoImageUrl.trim(),
        dimensions: this.photoDimensions.trim() || '60 x 40 cm · Fine Art',
        technicalSheet: this.photoTechnicalSheet.trim(),
        description: this.photoDescription.trim() || 'Fotografía profesional en alta resolución.'
      }, this.selectedPhotoFile || undefined)
      .pipe(
        catchError((err) => {
          const cleanMsg = this.shop.getCleanErrorMessage(err, 'actualizar la fotografía');
          this.handleRequestError(cleanMsg, err);
          return throwError(() => err);
        })
      )
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.cancelPhotoEdit();
          this.shop.showAlert('success', '¡Fotografía actualizada con éxito!');
        },
        error: () => {
          this.isSubmitting.set(false);
          this.shop.closeAdminDashboard();
        }
      });
    } else {
      this.shop.addPhoto({
        title: this.photoTitle.trim(),
        category: categoryToSave,
        price: Number(this.photoPrice),
        imageUrl: this.photoImageUrl.trim(),
        dimensions: this.photoDimensions.trim() || '60 x 40 cm · Fine Art',
        technicalSheet: this.photoTechnicalSheet.trim(),
        description: this.photoDescription.trim() || 'Fotografía profesional en alta resolución.',
        inStock: true,
        badge: 'Nuevo'
      }, this.selectedPhotoFile || undefined)
      .pipe(
        catchError((err) => {
          const cleanMsg = this.shop.getCleanErrorMessage(err, 'publicar la nueva fotografía');
          this.handleRequestError(cleanMsg, err);
          return throwError(() => err);
        })
      )
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.resetPhotoForm();
          this.shop.editingPhoto.set(null);
          this.shop.showAlert('success', '¡Fotografía publicada con éxito en el catálogo!');
        },
        error: () => {
          this.isSubmitting.set(false);
          this.shop.closeAdminDashboard();
        }
      });
    }
  }

  startPhotoEdit(photo: Photo): void {
    this.editingPhotoId.set(photo.id);
    this.photoTitle = photo.title;
    this.photoCategory = photo.category;
    this.photoPrice = photo.price;
    this.photoImageUrl = photo.imageUrl;
    this.photoDimensions = photo.dimensions;
    this.photoTechnicalSheet = photo.technicalSheet;
    this.photoDescription = photo.description;
    this.selectedPhotoFile = null;
    this.switchTab('photos');
    this.resetScroll();
  }

  cancelPhotoEdit(): void {
    this.editingPhotoId.set(null);
    this.resetPhotoForm();
    this.shop.editingPhoto.set(null);
  }

  deletePhoto(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta fotografía del catálogo?')) {
      this.isSubmitting.set(true);
      this.shop.deletePhoto(id)
        .pipe(
          catchError((err) => {
            const cleanMsg = this.shop.getCleanErrorMessage(err, 'eliminar la fotografía del catálogo');
            this.handleRequestError(cleanMsg, err);
            return throwError(() => err);
          })
        )
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            if (this.editingPhotoId() === id) {
              this.cancelPhotoEdit();
            }
            this.shop.showAlert('success', 'Fotografía eliminada correctamente.');
          },
          error: () => {
            this.isSubmitting.set(false);
            this.shop.closeAdminDashboard();
          }
        });
    }
  }

  private resetPhotoForm(): void {
    this.photoTitle = '';
    this.photoCategory = 'Foto Producto';
    this.isCreatingNewCategory.set(false);
    this.newCategoryName = '';
    this.photoPrice = 120;
    this.photoImageUrl = '';
    this.photoDimensions = '60 x 40 cm · Fine Art';
    this.photoTechnicalSheet = '';
    this.photoDescription = '';
    this.selectedPhotoFile = null;
  }

  // --- SERVICE CRUD ---
  isServiceFormValid(): boolean {
    return this.serviceTitle.trim().length > 0 &&
      this.serviceDescription.trim().length > 0 &&
      this.serviceImageUrl.trim().length > 0;
  }

  saveService(): void {
    if (!this.isServiceFormValid() || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const featuresArray = this.serviceFeaturesString
      ? this.serviceFeaturesString.split(',').map(f => f.trim()).filter(f => f.length > 0)
      : ['Cobertura integral', 'Edición profesional'];

    if (this.editingServiceId()) {
      const serviceId = this.editingServiceId()!;
      this.shop.updateService(serviceId, {
        title: this.serviceTitle.trim(),
        description: this.serviceDescription.trim(),
        imageUrl: this.serviceImageUrl.trim(),
        features: featuresArray
      })
      .pipe(
        catchError((err) => {
          const cleanMsg = this.shop.getCleanErrorMessage(err, 'actualizar el servicio');
          this.handleRequestError(cleanMsg, err);
          return throwError(() => err);
        })
      )
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.cancelServiceEdit();
          this.shop.showAlert('success', 'Servicio actualizado correctamente.');
        },
        error: () => {
          this.isSubmitting.set(false);
          this.shop.closeAdminDashboard();
        }
      });
    } else {
      this.shop.addService({
        title: this.serviceTitle.trim(),
        description: this.serviceDescription.trim(),
        imageUrl: this.serviceImageUrl.trim(),
        features: featuresArray,
        whatsappUrl: this.shop.defaultWhatsAppUrl
      })
      .pipe(
        catchError((err) => {
          const cleanMsg = this.shop.getCleanErrorMessage(err, 'crear el nuevo servicio');
          this.handleRequestError(cleanMsg, err);
          return throwError(() => err);
        })
      )
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.resetServiceForm();
          this.shop.editingService.set(null);
          this.shop.showAlert('success', '¡Servicio creado y publicado correctamente!');
        },
        error: () => {
          this.isSubmitting.set(false);
          this.shop.closeAdminDashboard();
        }
      });
    }
  }

  startServiceEdit(service: ServiceItem): void {
    this.editingServiceId.set(service.id);
    this.serviceTitle = service.title;
    this.serviceImageUrl = service.imageUrl;
    this.serviceDescription = service.description;
    this.serviceFeaturesString = (service.features || []).join(', ');
    this.switchTab('services');
    this.resetScroll();
  }

  cancelServiceEdit(): void {
    this.editingServiceId.set(null);
    this.resetServiceForm();
    this.shop.editingService.set(null);
  }

  deleteService(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      this.isSubmitting.set(true);
      this.shop.deleteService(id)
        .pipe(
          catchError((err) => {
            const cleanMsg = this.shop.getCleanErrorMessage(err, 'eliminar el servicio');
            this.handleRequestError(cleanMsg, err);
            return throwError(() => err);
          })
        )
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            if (this.editingServiceId() === id) {
              this.cancelServiceEdit();
            }
            this.shop.showAlert('success', 'Servicio eliminado correctamente.');
          },
          error: () => {
            this.isSubmitting.set(false);
            this.shop.closeAdminDashboard();
          }
        });
    }
  }

  private resetServiceForm(): void {
    this.serviceTitle = '';
    this.serviceImageUrl = '';
    this.serviceDescription = '';
    this.serviceFeaturesString = '';
  }

  // --- PROFILE EDIT CON ETIQUETAS DINÁMICAS ---
  saveProfile(): void {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);

    this.shop.updateProfile({
      name: this.profileName.trim(),
      title: this.profileTitle.trim(),
      location: this.profileLocation.trim(),
      imageUrl: this.profileImageUrl.trim(),
      bio: this.profileBio.trim(),
      instagram: this.profileInstagram.trim(),
      whatsapp: this.profileWhatsapp.trim(),
      email: this.profileEmail.trim(),
      tags: this.profileTags()
    }, this.selectedProfileFile || undefined)
    .pipe(
      catchError((err) => {
        const cleanMsg = this.shop.getCleanErrorMessage(err, 'actualizar el perfil');
        this.handleRequestError(cleanMsg, err);
        return throwError(() => err);
      })
    )
    .subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.selectedProfileFile = null;
        this.profileSavedMessage.set(true);
        this.shop.showAlert('success', '¡Perfil y etiquetas actualizados permanentemente!');
        setTimeout(() => {
          this.profileSavedMessage.set(false);
        }, 2500);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.shop.closeAdminDashboard();
      }
    });
  }
}
