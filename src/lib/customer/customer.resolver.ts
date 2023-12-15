
import { createResolver } from '$admin/entity/resolver.server';
import type { Customer } from './customer.entity';

export const CustomerResolver = createResolver<Customer>({
  normalize: (customer: Customer) => {
    return {
      ...customer,
      totalOrders: customer.orders ? customer.orders.length : undefined
    };
  }
});
