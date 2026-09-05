import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartDrawerComponent } from './cart-drawer.component';
import { ShopService, OrderRequest } from '../../services/shop.service';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

describe('CartDrawerComponent', () => {
  let component: CartDrawerComponent;
  let fixture: ComponentFixture<CartDrawerComponent>;
  let shopServiceMock: any;

  beforeEach(async () => {
    shopServiceMock = {
      isCartOpen: signal(true),
      cart: signal([
        {
          photo: {
            id: 'photo-1',
            title: 'Mar del Plata Acantilados',
            price: 130,
            imageUrl: 'https://example.com/p1.jpg',
            category: 'Paisajismo'
          },
          quantity: 1
        }
      ]),
      cartCount: signal(1),
      cartTotal: signal(130),
      closeCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      initiateMercadoPagoCheckout: vi.fn().mockReturnValue(of({
        preferenceId: 'pref-123',
        initPoint: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref-123',
        sandboxInitPoint: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref-123',
        orderId: 'ORD-TEST-1'
      })),
      getCleanErrorMessage: vi.fn().mockReturnValue('Error de prueba en checkout')
    };

    await TestBed.configureTestingModule({
      imports: [CartDrawerComponent],
      providers: [
        { provide: ShopService, useValue: shopServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente del carrito', () => {
    expect(component).toBeTruthy();
  });

  it('debe exigir nombre y contacto antes de iniciar el pago', () => {
    component.customerName = '';
    component.customerContact = '';
    component.initiatePayment();

    expect(component.validationError()).toContain('completa tu Nombre y Email o WhatsApp');
    expect(shopServiceMock.initiateMercadoPagoCheckout).not.toHaveBeenCalled();
  });

  it('debe enviar la orden e iniciar checkout si los campos están completos', () => {
    component.customerName = 'Elena Diaz';
    component.customerContact = 'elena@gmail.com';
    component.initiatePayment();

    expect(component.validationError()).toBeNull();
    expect(shopServiceMock.initiateMercadoPagoCheckout).toHaveBeenCalled();
  });

  it('debe manejar errores del backend sin cerrar el carrito', () => {
    shopServiceMock.initiateMercadoPagoCheckout.mockReturnValue(
      throwError(() => new Error('Error de servidor'))
    );

    component.customerName = 'Elena Diaz';
    component.customerContact = 'elena@gmail.com';
    component.initiatePayment();

    expect(component.isCheckingOut()).toBe(false);
    expect(component.errorMessage()).toBe('Error de prueba en checkout');
  });
});
