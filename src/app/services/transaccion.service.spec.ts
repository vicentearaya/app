import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransaccionService } from './transaccion.service';
import { Transaccion, DetalleTransaccion } from '../models/transaccion';
import { environment } from '../../environments/environment';

describe('TransaccionService', () => {
  let service: TransaccionService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/transacciones`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransaccionService]
    });
    service = TestBed.inject(TransaccionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return an array of transacciones', () => {
      const mockTransacciones: Transaccion[] = [
        {
          id: 1,
          vale_id: 1,
          total: 500,
          fecha: '2025-01-13',
          detalles: [
            {
              id: 1,
              transaccion_id: 1,
              producto_id: 1,
              cantidad: 2,
              precio_unitario: 250,
              subtotal: 500
            }
          ]
        },
        {
          id: 2,
          vale_id: 2,
          total: 300,
          fecha: '2025-01-13'
        }
      ];

      service.getAll().subscribe(transacciones => {
        expect(transacciones.length).toBe(2);
        expect(transacciones).toEqual(mockTransacciones);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockTransacciones);
    });
  });

  describe('getById', () => {
    it('should return a single transaccion', () => {
      const mockTransaccion: Transaccion = {
        id: 1,
        vale_id: 1,
        total: 500,
        fecha: '2025-01-13',
        detalles: [
          {
            id: 1,
            transaccion_id: 1,
            producto_id: 1,
            cantidad: 2,
            precio_unitario: 250,
            subtotal: 500
          }
        ]
      };

      service.getById(1).subscribe(transaccion => {
        expect(transaccion).toEqual(mockTransaccion);
        expect(transaccion.id).toBe(1);
        expect(transaccion.detalles?.length).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTransaccion);
    });
  });

  describe('getByVale', () => {
    it('should return transacciones for a specific vale', () => {
      const valeId = 1;
      const mockTransacciones: Transaccion[] = [
        {
          id: 1,
          vale_id: 1,
          total: 500,
          fecha: '2025-01-13'
        }
      ];

      service.getByVale(valeId).subscribe(transacciones => {
        expect(transacciones.length).toBe(1);
        expect(transacciones[0].vale_id).toBe(valeId);
      });

      const req = httpMock.expectOne(`${apiUrl}/vale/${valeId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTransacciones);
    });
  });

  describe('create', () => {
    it('should create a new transaccion', () => {
      const newTransaccion = {
        vale_id: 1,
        total: 500,
        fecha: '2025-01-13',
        detalles: [
          {
            producto_id: 1,
            cantidad: 2,
            precio_unitario: 250,
            subtotal: 500
          }
        ]
      };

      const createdTransaccion: Transaccion = {
        id: 1,
        ...newTransaccion,
        detalles: [
          {
            id: 1,
            transaccion_id: 1,
            ...newTransaccion.detalles[0]
          }
        ]
      };

      service.create(newTransaccion).subscribe(transaccion => {
        expect(transaccion).toEqual(createdTransaccion);
        expect(transaccion.id).toBe(1);
        expect(transaccion.total).toBe(500);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTransaccion);
      req.flush(createdTransaccion);
    });
  });

  describe('delete', () => {
    it('should delete a transaccion', () => {
      service.delete(1).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});

