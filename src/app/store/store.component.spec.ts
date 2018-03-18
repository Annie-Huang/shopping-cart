import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreComponent } from './store.component';
import {ShoppingCartComponent} from '../shopping-cart/shopping-cart.component';
import {ShoppingCartService} from '../shopping-cart/service/shopping-cart.service';
import {Product} from './service/product';
import {ProductService} from './service/product.service';
import {Observable} from 'rxjs/Observable';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {UrlConfig} from '../../environments/url-config';
import {UserService} from './service/user.service';
import {User} from './service/user';
import {PricingRule} from '../shopping-cart/service/pricing-rule';
import Spy = jasmine.Spy;
import {SpyObject} from '../../spec/helper';
import {MockShoppingCartService} from '../../spec/mock-shopping-cart.service';


declare var require: any;

class MockUserService extends SpyObject {
    getUserById: Spy;
    constructor() {
        super( UserService );
        this.getUserById = this.spy('getUserById');
    }
}

class MockProductService extends SpyObject {
    getAll: Spy;
    constructor() {
        super( ProductService );
        this.getAll = this.spy('getAll');
    }
}

describe('StoreComponent', () => {
    const products: Product[] = require('../../resources/fixtures/products.json');
    const userFord: User = require('../../resources/fixtures/user-ford.json');
    const productClassic: Product = products[0];
    let component: StoreComponent;
    let fixture: ComponentFixture<StoreComponent>;

    let mockUserService: MockUserService;
    let mockProductService: MockProductService;
    let mockShoppingCartService: MockShoppingCartService;

    beforeEach(() => {
        mockUserService = new MockUserService();
        mockProductService = new MockProductService();
        mockShoppingCartService = new MockShoppingCartService();
        TestBed.configureTestingModule({
            declarations: [ ShoppingCartComponent, StoreComponent ],
            imports: [ HttpClientTestingModule ],
            providers: [
                { provide: UserService, useValue: mockUserService },
                { provide: ProductService, useValue: mockProductService },
                { provide: ShoppingCartService, useValue: mockShoppingCartService},
                UrlConfig
            ]
        });
        fixture = TestBed.createComponent(StoreComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngOnInit should set products and user information', () => {
        mockUserService.getUserById.and.returnValue(Observable.of(userFord));
        mockProductService.getAll.and.returnValue(Observable.of(products));
        component.ngOnInit();
        expect(component.user).toBe(userFord);
        expect(mockShoppingCartService.setPricingRules).toHaveBeenCalledWith(userFord.pricingRules);
        expect(component.products).toBe(products);
        expect(component.products[0].productInCart).toBe(true);

        component.ngOnDestroy();
    });

    it('#addProductToCart should call shoppingCartService addItem', () => {
        component.addProductToCart(productClassic);
        expect(mockShoppingCartService.addItem).toHaveBeenCalledWith(productClassic);
    });

    it('#removeProductFromCart should call shoppingCartService removeItem', () => {
        component.removeProductFromCart(productClassic);
        expect(mockShoppingCartService.removeItem).toHaveBeenCalledWith(productClassic);
    });

    it('#setPricingRulesForDisplay should not set pricingRules msg if rules is undefined or null', () => {
        component.setPricingRulesForDisplay(undefined);
        expect(component.pricingRules.length).toBe(0);
        component.setPricingRulesForDisplay(null);
        expect(component.pricingRules.length).toBe(0);
    });

    it('#setPricingRulesForDisplay should set pricingRules msg for buyXQtyForYQtyPrice', () => {
        component.products = products;
        component.setPricingRulesForDisplay([userFord.pricingRules[0]]);
        expect(component.pricingRules.length).toBe(1);
        expect(component.pricingRules[0]).toBe('Gets a **5 for 4 deal on Classic Ads**');
    });

    it('#setPricingRulesForDisplay should set pricingRules msg for newUnitPrice', () => {
        component.products = products;
        component.setPricingRulesForDisplay([userFord.pricingRules[1]]);
        expect(component.pricingRules.length).toBe(1);
        expect(component.pricingRules[0]).toBe('Gets a discount on **Standout Ads where the price drops to $309.99 per ad**');
    });

    it('#setPricingRulesForDisplay should set pricingRules msg for newUnitPriceWithMinQty', () => {
        component.products = products;
        component.setPricingRulesForDisplay([userFord.pricingRules[2]]);
        expect(component.pricingRules.length).toBe(1);
        expect(component.pricingRules[0]).toBe(
            'Gets a discount on **Premium Ads when 3 or more** are purchased. The price drops to **$389.99 per ad**');
    });

    it('#setPricingRulesForDisplay should not set pricingRules msg for unknown price rule', () => {
        component.products = products;
        const pricingRule: PricingRule = userFord.pricingRules[0];
        pricingRule.ruleName = 'abc';
        component.setPricingRulesForDisplay([pricingRule]);
        expect(component.pricingRules.length).toBe(0);
    });
});
