import {ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartComponent } from './shopping-cart.component';
import {ShoppingCartService} from './service/shopping-cart.service';
import {UrlConfig} from '../../environments/url-config';
import {MockShoppingCartService} from '../../spec/mock-shopping-cart.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ShoppingCartComponent', () => {
    let component: ShoppingCartComponent;
    let fixture: ComponentFixture<ShoppingCartComponent>;
    let mockShoppingCartService: MockShoppingCartService;

    beforeEach(() => {
        mockShoppingCartService = new MockShoppingCartService();
        TestBed.configureTestingModule({
            declarations: [ ShoppingCartComponent ],
            imports: [ HttpClientTestingModule ],
            providers: [
                { provide: ShoppingCartService, useValue: mockShoppingCartService},
                UrlConfig
            ]
        });
        fixture = TestBed.createComponent(ShoppingCartComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngOnInit should set cart', () => {
        component.ngOnInit();
        expect(component.cart.items.length).toBe(1);
    });
});
