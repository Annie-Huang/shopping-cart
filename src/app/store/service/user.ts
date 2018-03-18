import {PricingRule} from '../../shopping-cart/service/pricing-rule';

export interface User {
    id: string;
    name: string;
    pricingRules?: PricingRule[];
}
