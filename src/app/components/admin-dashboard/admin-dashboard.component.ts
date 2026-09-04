import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';
import { Photo, PhotoCategory, ServiceItem, ProfileData } from '../../models/photo.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (shop.isAdminDashboardOpen()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md bg-slate-900/60 animate-fadeIn">
        
        <!-- Modal Card Dashboard -->
        <div class="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          
          <!-- Header Bar -->
          <div class="px-6 py-5 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="18" x="3" y="3" rx="2"/>
                  <path d="M7 7h10M7 12h10M7 17h10"/>
                </svg>
              </div>
              <div>
                <h3 class="font-display font-bold text-xl text-slate-900">Panel de Control Administradora</h3>
                <p class="text-xs text-slate-500">Sesión activa como: <strong class="text-teal-800">{{ auth.currentUser()?.email }}</strong></p>
              </div>
            </div>

            <!-- Close Button -->
            <button
              (click)="shop.closeAdminDashboard()"
              aria-label="Cerrar panel de administración"
              class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Tab Bar Navigation: Fotos vs Servicios vs Editar Perfil -->
          <div class="px-6 pt-4 border-b border-slate-200 bg-white flex items-center gap-4 overflow-x-auto">
            <button
              (click)="activeTab.set('photos')"
              class="pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap"
              [ngClass]="activeTab() === 'photos' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <span>Fotos ({{ shop.photos().length }})</span>
            </button>

            <button
              (click)="activeTab.set('services')"
              class="pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap"
              [ngClass]="activeTab() === 'services' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Servicios ({{ shop.services().length }})</span>
            </button>

            <button
              (click)="activeTab.set('profile')"
              class="pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap"
              [ngClass]="activeTab() === 'profile' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Editar Perfil & Sobre Mí</span>
            </button>
          </div>

          <!-- Body Content Area -->
          <div class="p-6 overflow-y-auto flex-grow space-y-8 bg-slate-50/50">

            <!-- TAB 1: GESTIÓN DE FOTOS -->
            @if (activeTab() === 'photos') {
              
              <!-- Photo Form (Create / Edit) -->
              <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="font-display font-bold text-base text-slate-800 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                    <span>{{ editingPhotoId() ? 'Editar Fotografía' : 'Subir Nueva Fotografía' }}</span>
                  </h4>
                  @if (editingPhotoId()) {
                    <button
                      (click)="cancelPhotoEdit()"
                      class="text-xs text-slate-500 hover:text-slate-700 underline">
                      Cancelar edición
                    </button>
                  }
                </div>

                <form (ngSubmit)="savePhoto()" class="space-y-4">
                  
                  <!-- Drag & Drop / Image URL input -->
                  <div class="space-y-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">
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
                          <img [src]="photoImageUrl" alt="Vista previa" class="h-20 w-28 object-cover rounded-lg border border-slate-200 shadow-xs"/>
                          <div class="text-left text-xs">
                            <span class="font-semibold text-slate-800 block">Imagen lista</span>
                            <span class="text-teal-600 hover:underline">Haz clic o arrastra para cambiar</span>
                          </div>
                        </div>
                      } @else {
                        <div class="flex items-center justify-center gap-2 text-xs text-slate-600">
                          <svg class="w-5 h-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                      placeholder="O pega una URL directa de imagen..."
                      class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-teal-500"/>
                  </div>

                  <!-- Title & Category -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Título de la Obra *
                      </label>
                      <input
                        type="text"
                        required
                        [(ngModel)]="photoTitle"
                        name="photoTitle"
                        placeholder="Ej: Olas al Atardecer"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-teal-500"/>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Categoría *
                      </label>
                      <select
                        [(ngModel)]="photoCategory"
                        name="photoCategory"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-teal-500">
                        <option value="Foto Producto">Foto Producto</option>
                        <option value="Paisajismo">Paisajismo</option>
                        <option value="Eventos">Eventos</option>
                      </select>
                    </div>
                  </div>

                  <!-- MANDATORY FICHA TÉCNICA FIELD -->
                  <div class="p-4 rounded-xl bg-teal-50/70 border border-teal-200/90 space-y-1.5">
                    <label class="block text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                      <svg class="w-4 h-4 text-teal-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      <span>Ficha Técnica (Campo Obligatorio) *</span>
                    </label>
                    <p class="text-[11.5px] text-teal-800 font-normal">
                      Indica la cámara, lente y ajustes de toma (apertura, velocidad, ISO).
                    </p>
                    <input
                      type="text"
                      required
                      [(ngModel)]="photoTechnicalSheet"
                      name="photoTechnicalSheet"
                      placeholder="Ej: Sony Alpha 7 IV · FE 24-70mm f/2.8 · f/2.8 · 1/500s · ISO 100"
                      class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-teal-300 text-slate-900 text-sm font-mono focus:outline-none focus:border-teal-600"/>
                  </div>

                  <!-- Price & Dimensions -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Precio (USD) *
                      </label>
                      <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          min="1"
                          required
                          [(ngModel)]="photoPrice"
                          name="photoPrice"
                          placeholder="120"
                          class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-teal-500"/>
                      </div>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Formato / Dimensiones
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="photoDimensions"
                        name="photoDimensions"
                        placeholder="Ej: 60 x 40 cm · Fine Art"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-teal-500"/>
                    </div>
                  </div>

                  <!-- Description -->
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Descripción
                    </label>
                    <textarea
                      rows="2"
                      [(ngModel)]="photoDescription"
                      name="photoDescription"
                      placeholder="Concepto de la toma, iluminación o detalles de locación..."
                      class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-teal-500"></textarea>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      [disabled]="!isPhotoFormValid()"
                      class="btn-fresh-gradient px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                      </svg>
                      <span>{{ editingPhotoId() ? 'Guardar Cambios' : 'Publicar Fotografía' }}</span>
                    </button>
                  </div>

                </form>
              </div>

              <!-- Table of Photos (CRUD List) -->
              <div class="space-y-3">
                <h4 class="font-display font-bold text-base text-slate-800">
                  Fotografías en Catálogo Activo ({{ shop.photos().length }})
                </h4>

                <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs text-slate-700">
                      <thead class="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <tr>
                          <th class="p-3.5">Foto</th>
                          <th class="p-3.5">Título</th>
                          <th class="p-3.5">Categoría</th>
                          <th class="p-3.5">Ficha Técnica</th>
                          <th class="p-3.5">Precio</th>
                          <th class="p-3.5 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        @for (photo of shop.photos(); track photo.id) {
                          <tr class="hover:bg-slate-50/80 transition-colors">
                            <td class="p-3.5">
                              <img [src]="photo.imageUrl" [alt]="photo.title" class="w-12 h-12 rounded-lg object-cover border border-slate-200"/>
                            </td>
                            <td class="p-3.5 font-semibold text-slate-900 max-w-[150px] truncate">
                              {{ photo.title }}
                            </td>
                            <td class="p-3.5">
                              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                                {{ photo.category }}
                              </span>
                            </td>
                            <td class="p-3.5 font-mono text-[10.5px] text-slate-600 max-w-[200px] truncate" [title]="photo.technicalSheet">
                              {{ photo.technicalSheet }}
                            </td>
                            <td class="p-3.5 font-bold text-slate-900">
                              \${{ photo.price }} USD
                            </td>
                            <td class="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                (click)="startPhotoEdit(photo)"
                                title="Editar foto"
                                class="px-2.5 py-1 rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors">
                                Editar
                              </button>
                              <button
                                (click)="deletePhoto(photo.id)"
                                title="Eliminar foto"
                                class="px-2.5 py-1 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors">
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

            } @else if (activeTab() === 'services') {
              
              <!-- TAB 2: GESTIÓN DE SERVICIOS -->
              <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="font-display font-bold text-base text-slate-800 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                    <span>{{ editingServiceId() ? 'Editar Servicio' : 'Crear Nuevo Servicio de Cobertura' }}</span>
                  </h4>
                  @if (editingServiceId()) {
                    <button
                      (click)="cancelServiceEdit()"
                      class="text-xs text-slate-500 hover:text-slate-700 underline">
                      Cancelar edición
                    </button>
                  }
                </div>

                <form (ngSubmit)="saveService()" class="space-y-4">
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Título del Servicio *
                      </label>
                      <input
                        type="text"
                        required
                        [(ngModel)]="serviceTitle"
                        name="serviceTitle"
                        placeholder="Ej: Bautismos & Festejos Familiares"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-teal-500"/>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        URL de Imagen del Servicio *
                      </label>
                      <input
                        type="url"
                        required
                        [(ngModel)]="serviceImageUrl"
                        name="serviceImageUrl"
                        placeholder="https://images.unsplash.com/..."
                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-teal-500"/>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Descripción del Servicio *
                    </label>
                    <textarea
                      rows="2"
                      required
                      [(ngModel)]="serviceDescription"
                      name="serviceDescription"
                      placeholder="Explica qué incluye la cobertura fotográfica..."
                      class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-teal-500"></textarea>
                  </div>

                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Características Principales (separadas por coma)
                    </label>
                    <input
                      type="text"
                      [(ngModel)]="serviceFeaturesString"
                      name="serviceFeaturesString"
                      placeholder="Tomas espontáneas, Galería web privada, Fotos en alta resolución..."
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-teal-500"/>
                  </div>

                  <div class="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      [disabled]="!isServiceFormValid()"
                      class="btn-fresh-gradient px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                      </svg>
                      <span>{{ editingServiceId() ? 'Guardar Cambios' : 'Crear Servicio' }}</span>
                    </button>
                  </div>

                </form>
              </div>

              <!-- List of Services (CRUD List) -->
              <div class="space-y-3">
                <h4 class="font-display font-bold text-base text-slate-800">
                  Servicios Publicados ({{ shop.services().length }})
                </h4>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  @for (service of shop.services(); track service.id) {
                    <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                      <div class="flex items-start gap-3">
                        <img [src]="service.imageUrl" [alt]="service.title" class="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"/>
                        <div class="min-w-0">
                          <h5 class="font-display font-bold text-sm text-slate-900 truncate">{{ service.title }}</h5>
                          <p class="text-xs text-slate-500 line-clamp-2 mt-0.5">{{ service.description }}</p>
                        </div>
                      </div>

                      <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          (click)="startServiceEdit(service)"
                          class="px-2.5 py-1 text-xs rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 font-medium">
                          Editar
                        </button>
                        <button
                          (click)="deleteService(service.id)"
                          class="px-2.5 py-1 text-xs rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 font-medium">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>

            } @else {
              
              <!-- TAB 3: EDITAR PERFIL & SOBRE MÍ (NEW FEATURE) -->
              <div class="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h4 class="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-teal-500"></span>
                      <span>Editar Perfil & Sección Sobre Mí</span>
                    </h4>
                    <p class="text-xs text-slate-500 mt-0.5">
                      Personaliza tu foto de perfil y texto de presentación. Se guardará de forma persistente en tu navegador.
                    </p>
                  </div>

                  @if (profileSavedMessage()) {
                    <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold animate-fadeIn">
                      ✓ ¡Perfil Guardado con Éxito!
                    </span>
                  }
                </div>

                <form (ngSubmit)="saveProfile()" class="space-y-5">
                  
                  <!-- Profile Image Preview & URL / Drag Drop -->
                  <div class="space-y-3">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Foto de Perfil Profesional
                    </label>

                    <div class="flex flex-col sm:flex-row items-center gap-5">
                      <!-- Image Preview Avatar -->
                      <div class="w-28 h-28 rounded-2xl overflow-hidden border-2 border-teal-300 shadow-sm flex-shrink-0 bg-slate-100">
                        <img [src]="profileImageUrl" alt="Vista previa de perfil" class="w-full h-full object-cover"/>
                      </div>

                      <div class="flex-grow space-y-2 w-full">
                        <input
                          type="url"
                          required
                          [(ngModel)]="profileImageUrl"
                          name="profileImageUrl"
                          placeholder="https://images.unsplash.com/..."
                          class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-teal-500"/>
                        <p class="text-[11px] text-slate-500">
                          Ingresa una URL directa de tu fotografía o retrato profesional.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Name, Title, Location -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        required
                        [(ngModel)]="profileName"
                        name="profileName"
                        class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-teal-500"/>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Título Profesional
                      </label>
                      <input
                        type="text"
                        required
                        [(ngModel)]="profileTitle"
                        name="profileTitle"
                        class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-teal-500"/>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        required
                        [(ngModel)]="profileLocation"
                        name="profileLocation"
                        class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-teal-500"/>
                    </div>
                  </div>

                  <!-- Bio / Introduction text -->
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Texto de Presentación (Sección "Sobre Mí") *
                    </label>
                    <textarea
                      rows="4"
                      required
                      [(ngModel)]="profileBio"
                      name="profileBio"
                      placeholder="Escribe tu presentación profesional..."
                      class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-teal-500 leading-relaxed"></textarea>
                  </div>

                  <!-- Social Handles -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Instagram
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="profileInstagram"
                        name="profileInstagram"
                        placeholder="@julietamph_"
                        class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-teal-500"/>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        WhatsApp
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="profileWhatsapp"
                        name="profileWhatsapp"
                        placeholder="2281311917"
                        class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-teal-500"/>
                    </div>

                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        [(ngModel)]="profileEmail"
                        name="profileEmail"
                        placeholder="julietamarateo4@gmail.com"
                        class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-teal-500"/>
                    </div>
                  </div>

                  <!-- Save Button -->
                  <div class="pt-3 flex justify-end">
                    <button
                      type="submit"
                      class="btn-fresh-gradient px-7 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                      </svg>
                      <span>Guardar Perfil Permanentemente</span>
                    </button>
                  </div>

                </form>
              </div>

            }

          </div>

          <!-- Footer Bar -->
          <div class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>Los cambios se guardan localmente en tu navegador y se reflejan al instante.</span>
            <button
              (click)="shop.closeAdminDashboard()"
              class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors">
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

  readonly activeTab = signal<'photos' | 'services' | 'profile'>('photos');

  // Photo form
  editingPhotoId = signal<string | null>(null);
  photoTitle = '';
  photoCategory: PhotoCategory = 'Foto Producto';
  photoPrice = 120;
  photoImageUrl = '';
  photoDimensions = '60 x 40 cm · Fine Art';
  photoTechnicalSheet = '';
  photoDescription = '';

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
  profileSavedMessage = signal<boolean>(false);

  constructor() {
    // Sync initial tab when triggered
    effect(() => {
      this.activeTab.set(this.shop.adminInitialTab());
    });

    // Populate profile form fields from shop.profile()
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
    });
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
        const reader = new FileReader();
        reader.onload = () => {
          this.photoImageUrl = reader.result as string;
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
    if (!this.isPhotoFormValid()) return;

    if (this.editingPhotoId()) {
      this.shop.updatePhoto(this.editingPhotoId()!, {
        title: this.photoTitle.trim(),
        category: this.photoCategory,
        price: Number(this.photoPrice),
        imageUrl: this.photoImageUrl.trim(),
        dimensions: this.photoDimensions.trim() || '60 x 40 cm · Fine Art',
        technicalSheet: this.photoTechnicalSheet.trim(),
        description: this.photoDescription.trim() || 'Fotografía profesional en alta resolución.'
      });
      this.cancelPhotoEdit();
    } else {
      this.shop.addPhoto({
        title: this.photoTitle.trim(),
        category: this.photoCategory,
        price: Number(this.photoPrice),
        imageUrl: this.photoImageUrl.trim(),
        dimensions: this.photoDimensions.trim() || '60 x 40 cm · Fine Art',
        technicalSheet: this.photoTechnicalSheet.trim(),
        description: this.photoDescription.trim() || 'Fotografía profesional en alta resolución.',
        inStock: true,
        badge: 'Nuevo'
      });
      this.resetPhotoForm();
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
  }

  cancelPhotoEdit(): void {
    this.editingPhotoId.set(null);
    this.resetPhotoForm();
  }

  deletePhoto(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta fotografía del catálogo?')) {
      this.shop.deletePhoto(id);
      if (this.editingPhotoId() === id) {
        this.cancelPhotoEdit();
      }
    }
  }

  private resetPhotoForm(): void {
    this.photoTitle = '';
    this.photoCategory = 'Foto Producto';
    this.photoPrice = 120;
    this.photoImageUrl = '';
    this.photoDimensions = '60 x 40 cm · Fine Art';
    this.photoTechnicalSheet = '';
    this.photoDescription = '';
  }

  // --- SERVICE CRUD ---
  isServiceFormValid(): boolean {
    return this.serviceTitle.trim().length > 0 &&
      this.serviceDescription.trim().length > 0 &&
      this.serviceImageUrl.trim().length > 0;
  }

  saveService(): void {
    if (!this.isServiceFormValid()) return;

    const featuresArray = this.serviceFeaturesString
      ? this.serviceFeaturesString.split(',').map(f => f.trim()).filter(f => f.length > 0)
      : ['Cobertura integral', 'Edición profesional'];

    if (this.editingServiceId()) {
      this.shop.updateService(this.editingServiceId()!, {
        title: this.serviceTitle.trim(),
        description: this.serviceDescription.trim(),
        imageUrl: this.serviceImageUrl.trim(),
        features: featuresArray
      });
      this.cancelServiceEdit();
    } else {
      this.shop.addService({
        title: this.serviceTitle.trim(),
        description: this.serviceDescription.trim(),
        imageUrl: this.serviceImageUrl.trim(),
        features: featuresArray,
        whatsappUrl: this.shop.defaultWhatsAppUrl
      });
      this.resetServiceForm();
    }
  }

  startServiceEdit(service: ServiceItem): void {
    this.editingServiceId.set(service.id);
    this.serviceTitle = service.title;
    this.serviceImageUrl = service.imageUrl;
    this.serviceDescription = service.description;
    this.serviceFeaturesString = (service.features || []).join(', ');
  }

  cancelServiceEdit(): void {
    this.editingServiceId.set(null);
    this.resetServiceForm();
  }

  deleteService(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      this.shop.deleteService(id);
      if (this.editingServiceId() === id) {
        this.cancelServiceEdit();
      }
    }
  }

  private resetServiceForm(): void {
    this.serviceTitle = '';
    this.serviceImageUrl = '';
    this.serviceDescription = '';
    this.serviceFeaturesString = '';
  }

  // --- PROFILE EDIT ---
  saveProfile(): void {
    this.shop.updateProfile({
      name: this.profileName.trim(),
      title: this.profileTitle.trim(),
      location: this.profileLocation.trim(),
      imageUrl: this.profileImageUrl.trim(),
      bio: this.profileBio.trim(),
      instagram: this.profileInstagram.trim(),
      whatsapp: this.profileWhatsapp.trim(),
      email: this.profileEmail.trim()
    });

    this.profileSavedMessage.set(true);
    setTimeout(() => {
      this.profileSavedMessage.set(false);
    }, 2500);
  }
}
