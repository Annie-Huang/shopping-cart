import {TestBed, inject, getTestBed} from '@angular/core/testing';

import { ProductService } from './product.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {UrlConfig} from '../../../environments/url-config';
import {Product} from './product';

describe('ProductService', () => {
    let injector: TestBed;
    let service: ProductService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [ProductService, UrlConfig]
        });
        injector = getTestBed();
        service = injector.get(ProductService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
        backend.verify();
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getAll should return all products', () => {
        const payload: Product[] = require('../../../resources/fixtures/products.json');

        service.getAll().subscribe(products => {
            expect(products.length).toBe(3);
            expect(products[0].id).toBe('classic');
            expect(products[1].id).toBe('standout');
            expect(products[2].id).toBe('premium');
        });

        const req = httpMock.expectOne('http://localhost:8080/v1/getProudcts');
        expect(req.request.method).toBe('GET');
        req.flush(payload);
    });

    it('#getAll should return error on backend error', () => {
        service.getAll().subscribe(() => {}, err => {
            expect(err.statusText).toBe('Unauthorized');
        });

        const req = httpMock.expectOne('http://localhost:8080/v1/getProudcts');
        expect(req.request.method).toBe('GET');
        req.error(null, { status: 401, statusText: 'Unauthorized' });
    });
});
