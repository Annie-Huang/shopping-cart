import {PriceCalculator} from './price-calculator';
import {CartItem} from '../service/cart-item';
import {Product} from '../../store/service/product';
import {PricingRule} from '../service/pricing-rule';

declare var require: any;
describe('PriceCalculator', () => {
    const products: Product[] = require('../../../resources/fixtures/products.json');
    const priceRules: PricingRule[] = require('../../../resources/fixtures/pricing-rules.json');
    let product: Product;
    let ruleBuyXQtyForYQtyPrice;
    let ruleNewUnitPrice;
    let ruleNewUnitPriceWithMinQty;

    beforeEach(() => {
        product = products[0];
        ruleBuyXQtyForYQtyPrice = priceRules[0];
        ruleNewUnitPrice = priceRules[1];
        ruleNewUnitPriceWithMinQty = priceRules[2];
    });

    it('#calculateCartItemPrice should do nothing if cartItem is null', () => {
        const cartItem: CartItem = null;
        PriceCalculator.calculateCartItemPrice(cartItem, ruleNewUnitPrice);
        expect(cartItem).toBeNull();
    });

    it('#calculateCartItemPrice should do nothing if cartItem is undefined', () => {
        const cartItem: CartItem = undefined;
        PriceCalculator.calculateCartItemPrice(cartItem, ruleNewUnitPrice);
        expect(cartItem).not.toBeDefined();
    });

    it('#calculateCartItemPrice should calculate existing unit price * quantity as the subtotal price if pricingRule is null', () => {
        const cartItem: CartItem = new CartItem();
        cartItem.product = product;
        cartItem.product.price = 100;
        cartItem.quantity = 2;
        PriceCalculator.calculateCartItemPrice(cartItem, null);
        expect(cartItem.subTotal).toBe(200);
    });

    it('#calculateCartItemPrice should calculate existing unit price * quantity as the subtotal price if pricingRule is undefined', () => {
        const cartItem: CartItem = new CartItem();
        cartItem.product = product;
        cartItem.product.price = 100;
        cartItem.quantity = 2;
        PriceCalculator.calculateCartItemPrice(cartItem, undefined);
        expect(cartItem.subTotal).toBe(200);
    });

    it('#calculateCartItemPrice should calculate existing unit price * quantity as the subtotal price if ' +
        'productId in pricingRule does not match cartItem.product.id', () => {
        const cartItem: CartItem = new CartItem();
        cartItem.product = product;
        cartItem.product.price = 100;
        cartItem.quantity = 2;
        PriceCalculator.calculateCartItemPrice(cartItem, ruleNewUnitPrice);
        expect(cartItem.subTotal).toBe(200);
    });

    it('#calculateCartItemPrice should calculate the new unit price * quantity as the subtotal price if ' +
        'pricingRule is newUnitPrice', () => {
        const cartItem: CartItem = new CartItem();
        cartItem.product = product;
        cartItem.product.price = 100;
        cartItem.quantity = 2;
        cartItem.product.id = ruleNewUnitPrice.productId;
        ruleNewUnitPrice.attributes[0].value = 80;
        PriceCalculator.calculateCartItemPrice(cartItem, ruleNewUnitPrice);
        expect(cartItem.subTotal).toBe(160);
    });

    it('#calculateCartItemPrice should calculate the existing unit price * quantity as the subtotal price if ' +
        'pricingRule is ruleNewUnitPriceWithMinQty and cartItem quantity < minQty', () => {
        const cartItem: CartItem = new CartItem();
        cartItem.product = product;
        cartItem.product.price = 100;
        cartItem.quantity = 2;
        cartItem.product.id = ruleNewUnitPriceWithMinQty.productId;
        ruleNewUnitPriceWithMinQty.attributes[0].value = 5; // minQty
        ruleNewUnitPriceWithMinQty.attributes[1].value = 80; // newPrice
        PriceCalculator.calculateCartItemPrice(cartItem, ruleNewUnitPriceWithMinQty);
        expect(cartItem.subTotal).toBe(200);
    });

    it('#calculateCartItemPrice should calculate the new unit price * quantity as the subtotal price if ' +
        'pricingRule is ruleNewUnitPriceWithMinQty and cartItem quantity = minQty', () => {
        const cartItem: CartItem = new CartItem();
        cartItem.product = product;
        cartItem.product.price = 100;
        cartItem.quantity = 2;
        cartItem.product.id = ruleNewUnitPriceWithMinQty.productId;
        ruleNewUnitPriceWithMinQty.attributes[0].value = 2; // minQty
        ruleNewUnitPriceWithMinQty.attributes[1].value = 80; // newPrice
        PriceCalculator.calculateCartItemPrice(cartItem, ruleNewUnitPriceWithMinQty);
        expect(cartItem.subTotal).toBe(160);
    });

    it('#calculateCartItemPrice should calculate the new unit price * quantity as the subtotal price if ' +
        'pricingRule is ruleNewUnitPriceWithMinQty and cartItem quantity > minQty', () => {
        const cartItem: CartItem = new CartItem();
        cartItem.product = product;
        cartItem.product.price = 100;
        cartItem.quantity = 3;
        cartItem.product.id = ruleNewUnitPriceWithMinQty.productId;
        ruleNewUnitPriceWithMinQty.attributes[0].value = 2; // minQty
        ruleNewUnitPriceWithMinQty.attributes[1].value = 80; // newPrice
        PriceCalculator.calculateCartItemPrice(cartItem, ruleNewUnitPriceWithMinQty);
        expect(cartItem.subTotal).toBe(240);
    });

    it('#calculateCartItemPrice should calculate the existing unit price * quantity as the subtotal price if ' +
        'pricingRule is buyXQtyForYQtyPrice and cartItem quantity < xQty', () => {
        const cartItem: CartItem = new CartItem();
        cartItem.product = product;
        cartItem.product.price = 100;
        cartItem.quantity = 3;
        cartItem.product.id = ruleBuyXQtyForYQtyPrice.productId;
        ruleBuyXQtyForYQtyPrice.attributes[0].value = 5; // xQty
        ruleBuyXQtyForYQtyPrice.attributes[1].value = 4; // yQty
        PriceCalculator.calculateCartItemPrice(cartItem, ruleBuyXQtyForYQtyPrice);
        expect(cartItem.subTotal).toBe(300);
    });

    it('#calculateCartItemPrice should calculate the new unit price * quantity as the subtotal price if ' +
        'pricingRule is buyXQtyForYQtyPrice and cartItem quantity = xQty', () => {
        const cartItem: CartItem = new CartItem();
        cartItem.product = product;
        cartItem.product.price = 100;
        cartItem.quantity = 5;
        cartItem.product.id = ruleBuyXQtyForYQtyPrice.productId;
        ruleBuyXQtyForYQtyPrice.attributes[0].value = 5; // xQty
        ruleBuyXQtyForYQtyPrice.attributes[1].value = 4; // yQty
        PriceCalculator.calculateCartItemPrice(cartItem, ruleBuyXQtyForYQtyPrice);
        expect(cartItem.subTotal).toBe(400);
    });

    it('#calculateCartItemPrice should calculate the new unit price * quantity as the subtotal price if ' +
        'pricingRule is buyXQtyForYQtyPrice and xQty < cartItem quantity > (2 * xQty)', () => {
        const cartItem: CartItem = new CartItem();
        cartItem.product = product;
        cartItem.product.price = 100;
        cartItem.quantity = 9;
        cartItem.product.id = ruleBuyXQtyForYQtyPrice.productId;
        ruleBuyXQtyForYQtyPrice.attributes[0].value = 5; // xQty
        ruleBuyXQtyForYQtyPrice.attributes[1].value = 4; // yQty
        PriceCalculator.calculateCartItemPrice(cartItem, ruleBuyXQtyForYQtyPrice);
        expect(cartItem.subTotal).toBe(800);
    });

    it('#calculateCartItemPrice should calculate the new unit price * quantity as the subtotal price if ' +
        'pricingRule is buyXQtyForYQtyPrice and cartItem quantity = (2 * xQty)', () => {
        const cartItem: CartItem = new CartItem();
        cartItem.product = product;
        cartItem.product.price = 100;
        cartItem.quantity = 10;
        cartItem.product.id = ruleBuyXQtyForYQtyPrice.productId;
        ruleBuyXQtyForYQtyPrice.attributes[0].value = 5; // xQty
        ruleBuyXQtyForYQtyPrice.attributes[1].value = 4; // yQty
        PriceCalculator.calculateCartItemPrice(cartItem, ruleBuyXQtyForYQtyPrice);
        expect(cartItem.subTotal).toBe(800);
    });

    it('#calculateCartItemPrice should calculate the new unit price * quantity as the subtotal price if ' +
        'pricingRule is buyXQtyForYQtyPrice and cartItem quantity > (3 * xQty)', () => {
        const cartItem: CartItem = new CartItem();
        cartItem.product = product;
        cartItem.product.price = 100;
        cartItem.quantity = 18;
        cartItem.product.id = ruleBuyXQtyForYQtyPrice.productId;
        ruleBuyXQtyForYQtyPrice.attributes[0].value = 5; // xQty
        ruleBuyXQtyForYQtyPrice.attributes[1].value = 4; // yQty
        PriceCalculator.calculateCartItemPrice(cartItem, ruleBuyXQtyForYQtyPrice);
        expect(cartItem.subTotal).toBe(1500);
    });

    it('#calculateCartItemPrice should calculate the existing unit price * quantity as the subtotal price if ' +
        'pricingRule is not recognize in the system', () => {
        const cartItem: CartItem = new CartItem();
        cartItem.product = product;
        cartItem.product.price = 100;
        cartItem.quantity = 18;
        const unknownRule: PricingRule = priceRules[0];
        unknownRule.ruleName = 'abc';
        cartItem.product.id = ruleBuyXQtyForYQtyPrice.productId;
        PriceCalculator.calculateCartItemPrice(cartItem, unknownRule);
        expect(cartItem.subTotal).toBe(1800);
    });
});
