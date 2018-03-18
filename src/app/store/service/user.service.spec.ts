import {TestBed, inject, getTestBed} from '@angular/core/testing';

import { UserService } from './user.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {UrlConfig} from '../../../environments/url-config';
import {Product} from './product';

describe('UserService', () => {
    let injector: TestBed;
    let service: UserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [UserService, UrlConfig]
        });
        injector = getTestBed();
        service = injector.get(UserService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
        backend.verify();
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getUserById should return user', () => {
        const payload: Product[] = require('../../../resources/fixtures/user-ford.json');
        const userId = 'Ford';

        service.getUserById(userId).subscribe(user => {
            expect(user.name).toBe('Ford');
            expect(user.pricingRules.length).toBe(3);
            expect(user.pricingRules[0].ruleName).toBe('buyXQtyForYQtyPrice');
            expect(user.pricingRules[1].ruleName).toBe('newUnitPrice');
            expect(user.pricingRules[2].ruleName).toBe('newUnitPriceWithMinQty');
        });

        const req = httpMock.expectOne('http://localhost:8080/v1/getUser/' + userId);
        expect(req.request.method).toBe('GET');
        req.flush(payload);
    });

    it('#getUserById should return error on backend error', () => {
        const userId = 'Ford';
        service.getUserById(userId).subscribe(() => {}, err => {
            expect(err.statusText).toBe('Unauthorized');
        });

        const req = httpMock.expectOne('http://localhost:8080/v1/getUser/' + userId);
        expect(req.request.method).toBe('GET');
        req.error(null, { status: 401, statusText: 'Unauthorized' });
    });
});
