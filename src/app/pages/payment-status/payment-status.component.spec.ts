import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { PaymentStatusComponent } from './payment-status.component';
import { ShopService } from '../../services/shop.service';

describe('PaymentStatusComponent', () => {
  let component: PaymentStatusComponent;
  let fixture: ComponentFixture<PaymentStatusComponent>;
  let shopServiceSpy: any;
  let routerSpy: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    shopServiceSpy = {
      clearCart: vi.fn(),
      openCart: vi.fn(),
      verifyOrderStatus: vi.fn().mockReturnValue(of({
        id: 'ORD-123',
        customerName: 'Juan Perez',
        customerContact: 'juan@test.com',
        status: 'CONFIRMED',
        subtotal: 100,
        total: 100,
        totalItems: 1,
        items: [],
        createdAt: '2026-09-05T00:00:00'
      }))
    };

    routerSpy = {
      navigate: vi.fn().mockResolvedValue(true)
    };

    activatedRouteMock = {
      queryParams: of({
        collection_status: 'approved',
        payment_id: '987654321',
        external_reference: 'ORD-123',
        preference_id: 'PREF-ABC'
      })
    };

    await TestBed.configureTestingModule({
      imports: [PaymentStatusComponent],
      providers: [
        { provide: ShopService, useValue: shopServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente de estado de pago', () => {
    expect(component).toBeTruthy();
  });

  it('debe procesar estado approved, vaciar el carrito y verificar la orden', () => {
    expect(component.statusNormalized()).toBe('approved');
    expect(component.paymentId()).toBe('987654321');
    expect(component.orderId()).toBe('ORD-123');
    expect(shopServiceSpy.clearCart).toHaveBeenCalled();
    expect(shopServiceSpy.verifyOrderStatus).toHaveBeenCalledWith('ORD-123');
  });

  it('retryCheckout debe navegar al inicio y abrir el carrito para reintentar', async () => {
    component.retryCheckout();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
