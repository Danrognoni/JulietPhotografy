import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { environment } from '../../environments/environment';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debe adjuntar Authorization: Bearer <token> para peticiones POST hacia la API si hay token', () => {
    localStorage.setItem('token', 'fake-jwt-token-123');

    http.post(`${environment.apiUrl}/photos`, { title: 'Test Photo' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/photos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-jwt-token-123');
    req.flush({});
  });

  it('debe adjuntar Authorization: Bearer <token> para peticiones PUT y DELETE', () => {
    localStorage.setItem('jm_auth_token', 'fake-jwt-token-456');

    http.put(`${environment.apiUrl}/photos/1`, { title: 'Updated Photo' }).subscribe();
    const putReq = httpMock.expectOne(`${environment.apiUrl}/photos/1`);
    expect(putReq.request.headers.get('Authorization')).toBe('Bearer fake-jwt-token-456');
    putReq.flush({});

    http.delete(`${environment.apiUrl}/photos/1`).subscribe();
    const deleteReq = httpMock.expectOne(`${environment.apiUrl}/photos/1`);
    expect(deleteReq.request.headers.get('Authorization')).toBe('Bearer fake-jwt-token-456');
    deleteReq.flush({});
  });

  it('no debe adjuntar encabezado Authorization si no hay token en localStorage', () => {
    http.post(`${environment.apiUrl}/photos`, { title: 'Public Photo' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/photos`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('debe propagar errores HTTP (como 403 Forbidden o status 0) para que puedan ser capturados', () => {
    localStorage.setItem('token', 'expired-token');

    let capturedError: any = null;
    http.post(`${environment.apiUrl}/photos`, {}).subscribe({
      error: (err) => {
        capturedError = err;
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/photos`);
    req.flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });

    expect(capturedError).toBeTruthy();
    expect(capturedError.status).toBe(403);
  });
});
