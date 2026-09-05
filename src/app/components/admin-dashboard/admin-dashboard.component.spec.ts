import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('AdminDashboardComponent - Manejo de Errores y Cierre de Modal', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let shopService: ShopService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        {
          provide: ShopService,
          useValue: {
            isAdminDashboardOpen: vi.fn().mockReturnValue(true),
            closeAdminDashboard: vi.fn(),
            adminInitialTab: vi.fn().mockReturnValue('photos'),
            photos: vi.fn().mockReturnValue([]),
            albumFolders: vi.fn().mockReturnValue([]),
            albumCategories: vi.fn().mockReturnValue(['Casamientos', 'Cumpleaños XV', 'Eventos', 'Paisajismo', 'Foto Producto']),
            albums: vi.fn().mockReturnValue([]),
            services: vi.fn().mockReturnValue([]),
            profile: vi.fn().mockReturnValue({ name: '', title: '', location: '', imageUrl: '', bio: '', instagram: '', whatsapp: '', email: '' }),
            editingPhoto: vi.fn().mockReturnValue(null),
            editingAlbum: vi.fn().mockReturnValue(null),
            editingService: vi.fn().mockReturnValue(null),
            heroPhoto: vi.fn().mockReturnValue({ id: 'photo-1', title: 'Foto' }),
            updatePhoto: vi.fn(),
            addPhoto: vi.fn(),
            deletePhoto: vi.fn(),
            addAlbum: vi.fn(),
            updateAlbum: vi.fn(),
            deleteAlbum: vi.fn(),
            updateService: vi.fn(),
            addService: vi.fn(),
            deleteService: vi.fn(),
            updateProfile: vi.fn(),
            uploadImage: vi.fn().mockReturnValue(of({ url: 'https://example.com/uploaded.jpg' })),
            showAlert: vi.fn(),
            getCleanErrorMessage: vi.fn().mockImplementation((err: any, action: string) => `Error limpio al ${action}`)
          }
        },
        {
          provide: AuthService,
          useValue: {
            currentUser: vi.fn().mockReturnValue({ email: 'admin@test.com', role: 'admin' }),
            isAdmin: vi.fn().mockReturnValue(true)
          }
        }
      ]
    });

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    shopService = TestBed.inject(ShopService);

    // Mock window.alert to avoid blocking test runners
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debe cerrar el modal y quitar el estado de carga cuando updatePhoto falla (ej. 403 Forbidden)', () => {
    const errorResponse = new HttpErrorResponse({ status: 403, statusText: 'Forbidden' });
    vi.spyOn(shopService, 'updatePhoto').mockReturnValue(throwError(() => errorResponse));

    component.editingPhotoId.set('photo-123');
    component.photoTitle = 'Título de prueba';
    component.photoPrice = 100;
    component.photoTechnicalSheet = 'Sony A7IV';
    component.photoImageUrl = 'https://example.com/photo.jpg';

    component.savePhoto();

    // Verificamos que no quede en estado submitting
    expect(component.isSubmitting()).toBe(false);
    // Verificamos que se haya invocado closeAdminDashboard para remover el backdrop y blur
    expect(shopService.closeAdminDashboard).toHaveBeenCalled();
    // Verificamos que se haya mostrado la alerta limpia
    expect(shopService.showAlert).toHaveBeenCalledWith('error', expect.stringContaining('actualizar la fotografía'), expect.any(Number));
  });

  it('debe cerrar el modal y quitar el estado de carga cuando addPhoto falla por error de CORS o status 0', () => {
    const errorResponse = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });
    vi.spyOn(shopService, 'addPhoto').mockReturnValue(throwError(() => errorResponse));

    component.editingPhotoId.set(null);
    component.photoTitle = 'Nueva foto';
    component.photoPrice = 150;
    component.photoTechnicalSheet = 'Canon R5';
    component.photoImageUrl = 'https://example.com/photo.jpg';

    component.savePhoto();

    expect(component.isSubmitting()).toBe(false);
    expect(shopService.closeAdminDashboard).toHaveBeenCalled();
    expect(shopService.showAlert).toHaveBeenCalledWith('error', expect.stringContaining('publicar la nueva fotografía'), expect.any(Number));
  });

  it('debe cerrar el panel al hacer clic en el backdrop', () => {
    const mockEvent = new MouseEvent('click');
    component.onBackdropClick(mockEvent);

    expect(shopService.closeAdminDashboard).toHaveBeenCalled();
  });
});
