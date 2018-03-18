import { TestBed, inject } from '@angular/core/testing';

import { ShoppingCartService } from './shopping-cart.service';
import {ShoppingCart} from './shopping-cart';
import {Product} from '../../store/service/product';
import {User} from '../../store/service/user';
import {CartItem} from './cart-item';

declare var require: any;
describe('ShoppingCartService - Integration', () => {
    const products: Product[] = require('../../../resources/fixtures/products.json');
    const userDefault: User = require('../../../resources/fixtures/user-default.json');
    const userUnilever: User = require('../../../resources/fixtures/user-unilever.json');
    const userApple: User = require('../../../resources/fixtures/user-apple.json');
    const userNike: User = require('../../../resources/fixtures/user-nike.json');
    const cartItemClassic: CartItem = new CartItem();
    cartItemClassic.product = products[0];
    const cartItemStandout: CartItem = new CartItem();
    cartItemStandout.product = products[1];
    const cartItemPremium: CartItem = new CartItem();
    cartItemPremium.product = products[2];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ShoppingCartService]
        });
    });

    /**
     * Below is for test against the requirement specification.
     */

    /**
     * Customer: default
     * ID added: `classic`, `standout`, `premium`
     * Total expected: $987.97
     */
    it('Test 1: #calculateCart should calculate cart.total for customer default who does not have special pricing rules',
        inject([ShoppingCartService], (service: ShoppingCartService) => {
            const cart: ShoppingCart = new ShoppingCart();
            cartItemClassic.quantity = 1;
            cartItemStandout.quantity = 1;
            cartItemPremium.quantity = 1;
            cart.items.push(cartItemClassic);
            cart.items.push(cartItemStandout);
            cart.items.push(cartItemPremium);

            service.calculateCart(cart, userDefault.pricingRules);
            expect(cart.total).toBe(987.97);
    }));

    /**
     * Customer: Unilever
     * ID added: `classic`, `classic`, `classic`, `premium`
     * Total expected: $934.97
     */
    it('Test 2: #calculateCart should calculate cart.total for customer Unilever who have the buyXQtyForYQtyPrice pricing rule',
        inject([ShoppingCartService], (service: ShoppingCartService) => {
            const cart: ShoppingCart = new ShoppingCart();
            cartItemClassic.quantity = 3;
            cartItemPremium.quantity = 1;
            cart.items.push(cartItemClassic);
            cart.items.push(cartItemPremium);

            service.calculateCart(cart, userUnilever.pricingRules);
            expect(cart.total).toBe(934.97);
        }));

    /**
     * Customer: Apple
     * ID added: `standout`, `standout`, `standout`, `premium`
     * Total expected: $1294.96
     */
    it('Test 3: #calculateCart should calculate cart.total for customer Apple who have the newUnitPrice pricing rule',
        inject([ShoppingCartService], (service: ShoppingCartService) => {
            const cart: ShoppingCart = new ShoppingCart();
            cartItemStandout.quantity = 3;
            cartItemPremium.quantity = 1;
            cart.items.push(cartItemStandout);
            cart.items.push(cartItemPremium);


            service.calculateCart(cart, userApple.pricingRules);
            expect(cart.total).toBe(1294.96);
        }));

    /**
     * Customer: Nike
     * ID added: `premium`, `premium`, `premium`, `premium`
     * Total expected: $1519.96
     */
    it('Test 4: #calculateCart should calculate cart.total for customer Nike who have the newUnitPriceWithMinQty pricing rule',
        inject([ShoppingCartService], (service: ShoppingCartService) => {
            const cart: ShoppingCart = new ShoppingCart();
            cartItemPremium.quantity = 4;
            cart.items.push(cartItemPremium);

            service.calculateCart(cart, userNike.pricingRules);
            expect(cart.total).toBe(1519.96);
        }));
});
