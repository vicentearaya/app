import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ValeService } from './vale.service';
import { Vale } from '../models/vale';
import { environment } from '../../environments/environment';

describe('ValeService', () => {
  let service: ValeService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/vales`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ValeService]
    });
    service = TestBed.inject(ValeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return an array of vales', () => {
      const mockVales: Vale[] = [
        {
          id: 1,
          codigo: 'VALE001',
          user_id: 1,
          servicio_id: 1,
          fecha_emision: '2025-01-01',
          fecha_vigencia: '2025-12-31',
          monto_inicial: 1000,
          monto_usado: 0,
          estado: 'activo',
          es_adicional: false,
          saldo_disponible: 1000
        },
        {
          id: 2,
          codigo: 'VALE002',
          user_id: 2,
          servicio_id: 1,
          fecha_emision: '2025-01-01',
          fecha_vigencia: '2025-12-31',
          monto_inicial: 500,
          monto_usado: 200,
          estado: 'activo',
          es_adicional: false,
          saldo_disponible: 300
        }
      ];

      service.getAll().subscribe(vales => {
        expect(vales.length).toBe(2);
        expect(vales).toEqual(mockVales);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockVales);
    });
  });

  describe('getById', () => {
    it('should return a single vale', () => {
      const mockVale: Vale = {
        id: 1,
        codigo: 'VALE001',
        user_id: 1,
        servicio_id: 1,
        fecha_emision: '2025-01-01',
        fecha_vigencia: '2025-12-31',
        monto_inicial: 1000,
        monto_usado: 0,
        estado: 'activo',
        es_adicional: false,
        saldo_disponible: 1000
      };

      service.getById(1).subscribe(vale => {
        expect(vale).toEqual(mockVale);
        expect(vale.id).toBe(1);
        expect(vale.codigo).toBe('VALE001');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockVale);
    });
  });

  describe('getByCodigo', () => {
    it('should return a vale by codigo', () => {
      const codigo = 'VALE001';
      const mockVale: Vale = {
        id: 1,
        codigo: 'VALE001',
        user_id: 1,
        servicio_id: 1,
        fecha_emision: '2025-01-01',
        fecha_vigencia: '2025-12-31',
        monto_inicial: 1000,
        monto_usado: 0,
        estado: 'activo',
        es_adicional: false,
        saldo_disponible: 1000
      };

      service.getByCodigo(codigo).subscribe(vale => {
        expect(vale).toEqual(mockVale);
        expect(vale.codigo).toBe(codigo);
      });

      const req = httpMock.expectOne(`${apiUrl}/buscar`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ codigo: codigo });
      req.flush(mockVale);
    });
  });

  describe('getByUser', () => {
    it('should return vales for a specific user', () => {
      const userId = 1;
      const mockVales: Vale[] = [
        {
          id: 1,
          codigo: 'VALE001',
          user_id: 1,
          servicio_id: 1,
          fecha_emision: '2025-01-01',
          fecha_vigencia: '2025-12-31',
          monto_inicial: 1000,
          monto_usado: 0,
          estado: 'activo',
          es_adicional: false
        }
      ];

      service.getByUser(userId).subscribe(vales => {
        expect(vales.length).toBe(1);
        expect(vales[0].user_id).toBe(userId);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockVales);
    });
  });

  describe('create', () => {
    it('should create a new vale', () => {
      const newVale: Vale = {
        codigo: 'VALE003',
        user_id: 1,
        servicio_id: 1,
        fecha_emision: '2025-01-13',
        fecha_vigencia: '2025-12-31',
        monto_inicial: 800,
        monto_usado: 0,
        estado: 'activo',
        es_adicional: false
      };

      const createdVale: Vale = {
        id: 3,
        ...newVale,
        saldo_disponible: 800
      };

      service.create(newVale).subscribe(vale => {
        expect(vale).toEqual(createdVale);
        expect(vale.id).toBe(3);
        expect(vale.codigo).toBe('VALE003');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newVale);
      req.flush(createdVale);
    });
  });

  describe('update', () => {
    it('should update an existing vale', () => {
      const updatedVale: Vale = {
        id: 1,
        codigo: 'VALE001',
        user_id: 1,
        servicio_id: 1,
        fecha_emision: '2025-01-01',
        fecha_vigencia: '2025-12-31',
        monto_inicial: 1000,
        monto_usado: 300,
        estado: 'activo',
        es_adicional: false,
        saldo_disponible: 700
      };

      service.update(1, updatedVale).subscribe(vale => {
        expect(vale).toEqual(updatedVale);
        expect(vale.monto_usado).toBe(300);
        expect(vale.saldo_disponible).toBe(700);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedVale);
      req.flush(updatedVale);
    });
  });

  describe('delete', () => {
    it('should delete a vale', () => {
      service.delete(1).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});

