import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ShopService, OrderRequest } from './shop.service';
import { environment } from '../../environments/environment';

describe('ShopService - Mercado Pago & Checkout', () => {
  let service: ShopService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShopService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    service = TestBed.inject(ShopService);
    httpMock = TestBed.inject(HttpTestingController);

    // Drenar llamadas automáticas de syncWithBackend en inicialización
    httpMock.match(`${environment.apiUrl}/photos`).forEach(req => req.flush([]));
    httpMock.match(`${environment.apiUrl}/services`).forEach(req => req.flush([]));
    httpMock.match(`${environment.apiUrl}/profile`).forEach(req => req.flush(null));
    httpMock.match(`${environment.apiUrl}/albums`).forEach(req => req.flush([]));
    httpMock.match(`${environment.apiUrl}/cover-photo`).forEach(req => req.flush(null));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse correctamente el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('initiateMercadoPagoCheckout debe crear orden y generar preferencia', () => {
    const orderData: OrderRequest = {
      customerName: 'Lucía Morales',
      customerContact: 'lucia@gmail.com',
      items: [{ photoId: 'photo-1', quantity: 2 }]
    };

    let resultResponse: any;
    service.initiateMercadoPagoCheckout(orderData).subscribe((res) => {
      resultResponse = res;
    });

    // 1. Espera la llamada POST a /orders
    const reqOrder = httpMock.expectOne(`${environment.apiUrl}/orders`);
    expect(reqOrder.request.method).toBe('POST');
    expect(reqOrder.request.body).toEqual(orderData);
    reqOrder.flush({
      id: 'ORD-2026-999',
      customerName: 'Lucía Morales',
      total: 260
    });

    // 2. Espera la llamada POST a /orders/{id}/preference
    const reqPref = httpMock.expectOne(`${environment.apiUrl}/orders/ORD-2026-999/preference`);
    expect(reqPref.request.method).toBe('POST');
    reqPref.flush({
      preferenceId: 'PREF-777',
      initPoint: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=PREF-777',
      sandboxInitPoint: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=PREF-777'
    });

    expect(resultResponse).toEqual({
      preferenceId: 'PREF-777',
      initPoint: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=PREF-777',
      sandboxInitPoint: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=PREF-777',
      orderId: 'ORD-2026-999'
    });
  });

  it('verifyOrderStatus debe consultar el endpoint GET /api/orders/{id}', () => {
    let orderResult: any;
    service.verifyOrderStatus('ORD-555').subscribe((order) => {
      orderResult = order;
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/orders/ORD-555`);
    expect(req.request.method).toBe('GET');
    req.flush({
      id: 'ORD-555',
      status: 'CONFIRMED',
      total: 150
    });

    expect(orderResult.id).toBe('ORD-555');
    expect(orderResult.status).toBe('CONFIRMED');
  });

  it('clearCart debe vaciar las fotografías del carrito', () => {
    service.addToCart({
      id: 'photo-test',
      title: 'Foto Prueba',
      category: 'Paisajismo',
      price: 100,
      imageUrl: 'https://test.com/foto.jpg',
      description: 'Desc',
      dimensions: '50x50',
      technicalSheet: 'Sony',
      inStock: true
    });

    expect(service.cart().length).toBeGreaterThan(0);
    service.clearCart();
    expect(service.cart().length).toBe(0);
  });
});
