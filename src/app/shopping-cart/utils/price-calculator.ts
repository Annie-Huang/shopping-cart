import {CartItem} from '../service/cart-item';
import {PricingRule} from '../service/pricing-rule';

const BUY_X_QTY_FOR_Y_QTY_PRICE = 'buyXQtyForYQtyPrice';
const NEW_UNIT_PRICE = 'newUnitPrice';
const NEW_UNIT_PRICE_WITH_MIN_QTY = 'newUnitPriceWithMinQty';

export class PriceCalculator {

    public static calculateCartItemPrice(cartItem: CartItem, pricingRule: PricingRule): void {
        if (cartItem === null || cartItem === undefined) {
            return;
        }

        if (pricingRule  === null || pricingRule === undefined || pricingRule.productId !== cartItem.product.id) {
            cartItem.subTotal = this.multiple(cartItem.product.price, cartItem.quantity);
        } else {
            this.calculateCartItemPriceFromPricingRule(pricingRule, cartItem);
        }
        cartItem.subTotal = Number(cartItem.subTotal.toFixed(2));
    }

    private static calculateCartItemPriceFromPricingRule(pricingRule: PricingRule, cartItem: CartItem) {
        let newPrice = 0;

        if (pricingRule.ruleName === NEW_UNIT_PRICE) {
            newPrice = pricingRule.attributes.find((attr) => attr.name === 'newPrice').value;
            cartItem.subTotal = this.multiple(newPrice, cartItem.quantity);

        } else if (pricingRule.ruleName === NEW_UNIT_PRICE_WITH_MIN_QTY) {
            newPrice = pricingRule.attributes.find((attr) => attr.name === 'newPrice').value;
            const minQty: number = pricingRule.attributes.find((attr) => attr.name === 'minQty').value;

            cartItem.subTotal = this.multiple(
                (cartItem.quantity >= minQty) ? newPrice : cartItem.product.price, cartItem.quantity);

        } else if (pricingRule.ruleName === BUY_X_QTY_FOR_Y_QTY_PRICE) {
            const xQty: number = pricingRule.attributes.find((attr) => attr.name === 'xQty').value;
            const yQty: number = pricingRule.attributes.find((attr) => attr.name === 'yQty').value;

            if (cartItem.quantity < xQty) {
                cartItem.subTotal = this.multiple(cartItem.product.price, cartItem.quantity);
            } else {
                const division = Math.trunc( cartItem.quantity / xQty);
                const remainder = cartItem.quantity % xQty;

                cartItem.subTotal = this.multiple(cartItem.product.price, yQty * division) +
                    this.multiple(cartItem.product.price, remainder);
            }

        } else {
            // Case the rule never defined in the front end system.
            cartItem.subTotal = this.multiple(cartItem.product.price, cartItem.quantity);
        }
    }

    private static multiple(unitPrice: number, qty: number): number {
        return unitPrice * qty;
    }

}
