import {TestBed, getTestBed} from '@angular/core/testing';
import { ShoppingCartService } from './shopping-cart.service';
import {ShoppingCart} from './shopping-cart';
import {Product} from '../../store/service/product';
import {User} from '../../store/service/user';
import {CartItem} from './cart-item';
import {PricingRule} from './pricing-rule';

describe('ShoppingCartService', () => {
    const products: Product[] = require('../../../resources/fixtures/products.json');
    const userFord: User = require('../../../resources/fixtures/user-ford.json');
    const productClassic: Product = products[0];
    const productStandout: Product = products[1];
    const cartItemClassic: CartItem = new CartItem();
    cartItemClassic.product = productClassic;
    cartItemClassic.quantity = 1;
    const cartItemStandout: CartItem = new CartItem();
    cartItemStandout.product = productStandout;
    cartItemStandout.quantity = 1;

    let injector: TestBed;
    let service: ShoppingCartService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ShoppingCartService]
        });
        injector = getTestBed();
        service = injector.get(ShoppingCartService);
        service.cart = new ShoppingCart();
        cartItemClassic.quantity = 1;
        cartItemStandout.quantity = 1;
        service.pricingRules = null;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#setPricingRules should set pricing rule for shopping cart of the current user', () => {
        const pricingRules: PricingRule[] = userFord.pricingRules;

        service.setPricingRules(pricingRules);
        expect(service.pricingRules).toBe(pricingRules);
    });

    it('#addItem should add item into the cart when the cart is empty - pricing rule not apply', () => {
        service.addItem(productClassic);
        expect(service.cart.items.length).toBe(1);
        expect(service.cart.items[0].product).toBe(productClassic);
        expect(service.cart.items[0].quantity).toBe(1);
        expect(service.cart.items[0].subTotal).toBe(productClassic.price);
        expect(service.cart.total).toBe(productClassic.price);
    });

    it('#addItem should add item into the cart when the cart is empty - pricing applied', () => {
        service.pricingRules = userFord.pricingRules;

        service.addItem(productStandout);
        expect(service.cart.items.length).toBe(1);
        expect(service.cart.items[0].product).toBe(productStandout);
        expect(service.cart.items[0].quantity).toBe(1);
        expect(service.cart.items[0].subTotal).toBe(309.99);
        expect(service.cart.total).toBe(309.99);
    });

    it('#addItem should add item into the cart when the cart not empty but does not contain the product', () => {
        service.cart.items.push(cartItemStandout);

        service.addItem(productClassic);
        expect(service.cart.items.length).toBe(2);
        expect(service.cart.items[1].product).toBe(productClassic);
        expect(service.cart.items[1].quantity).toBe(1);
        expect(service.cart.items[1].subTotal).toBe(productClassic.price);
        expect(service.cart.total).toBe(productClassic.price + productStandout.price);
    });

    it('#addItem should increase item quantity when the cart already contain the product', () => {
        service.cart.items.push(cartItemClassic);

        service.addItem(productClassic);
        expect(service.cart.items.length).toBe(1);
        expect(service.cart.items[0].product).toBe(productClassic);
        expect(service.cart.items[0].quantity).toBe(2);
        expect(service.cart.items[0].subTotal).toBe(productClassic.price * 2);
        expect(service.cart.total).toBe(productClassic.price * 2);
    });

    it('#removeItem should remove item from the cart when the item quantity in the cart is 1', () => {
        service.cart.items.push(cartItemClassic);

        service.removeItem(productClassic);
        expect(service.cart.total).toBe(0);
    });

    it('#removeItem should decrease item quality from the cart when quantity in the cart is larger 1', () => {
        cartItemClassic.quantity = 3;
        service.cart.items.push(cartItemClassic);

        service.removeItem(productClassic);
        expect(service.cart.items.length).toBe(1);
        expect(service.cart.items[0].product).toBe(productClassic);
        expect(service.cart.items[0].quantity).toBe(2);
        expect(service.cart.items[0].subTotal).toBe(productClassic.price * 2);
        expect(service.cart.total).toBe(productClassic.price * 2);
    });
});
