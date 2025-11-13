import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductoService } from './producto.service';
import { Producto } from '../models/producto';
import { environment } from '../../environments/environment';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/productos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoService]
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return an array of productos', () => {
      const mockProductos: Producto[] = [
        {
          id: 1,
          nombre: 'Producto 1',
          precio: 100,
          categoria: 'Bebidas',
          activo: true
        },
        {
          id: 2,
          nombre: 'Producto 2',
          precio: 200,
          categoria: 'Comida',
          activo: true
        }
      ];

      service.getAll().subscribe(productos => {
        expect(productos.length).toBe(2);
        expect(productos).toEqual(mockProductos);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockProductos);
    });

    it('should handle empty array', () => {
      service.getAll().subscribe(productos => {
        expect(productos.length).toBe(0);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getById', () => {
    it('should return a single producto', () => {
      const mockProducto: Producto = {
        id: 1,
        nombre: 'Producto 1',
        precio: 100,
        categoria: 'Bebidas',
        activo: true
      };

      service.getById(1).subscribe(producto => {
        expect(producto).toEqual(mockProducto);
        expect(producto.id).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducto);
    });
  });

  describe('getByCategoria', () => {
    it('should return productos filtered by categoria', () => {
      const categoria = 'Bebidas';
      const mockProductos: Producto[] = [
        {
          id: 1,
          nombre: 'Producto 1',
          precio: 100,
          categoria: 'Bebidas',
          activo: true
        }
      ];

      service.getByCategoria(categoria).subscribe(productos => {
        expect(productos.length).toBe(1);
        expect(productos[0].categoria).toBe(categoria);
      });

      const req = httpMock.expectOne(`${apiUrl}?categoria=${categoria}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProductos);
    });
  });

  describe('create', () => {
    it('should create a new producto', () => {
      const newProducto: Producto = {
        nombre: 'Nuevo Producto',
        precio: 150,
        categoria: 'Bebidas',
        activo: true
      };

      const createdProducto: Producto = {
        id: 3,
        ...newProducto
      };

      service.create(newProducto).subscribe(producto => {
        expect(producto).toEqual(createdProducto);
        expect(producto.id).toBe(3);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProducto);
      req.flush(createdProducto);
    });
  });

  describe('update', () => {
    it('should update an existing producto', () => {
      const updatedProducto: Producto = {
        id: 1,
        nombre: 'Producto Actualizado',
        precio: 120,
        categoria: 'Bebidas',
        activo: true
      };

      service.update(1, updatedProducto).subscribe(producto => {
        expect(producto).toEqual(updatedProducto);
        expect(producto.nombre).toBe('Producto Actualizado');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProducto);
      req.flush(updatedProducto);
    });
  });

  describe('delete', () => {
    it('should delete a producto', () => {
      service.delete(1).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});

