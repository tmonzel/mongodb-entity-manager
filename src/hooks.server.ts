import { createHttpHandle } from '$admin/router';
import { initializeAdmin } from '$admin/server';
import { CustomerEntity } from '$lib/customer/customer.entity';
import { OrderEntity, OrderItemResolver, OrderResolver } from '$lib/order/order.entity';
import { ProductEntity } from '$lib/product/product.entity';

// Setup all admin data
initializeAdmin({
	schema: {
		customers: CustomerEntity,
		products: ProductEntity,
		orders: OrderEntity,
	},

	resolvers: {
		Order: OrderResolver,
		OrderItem: OrderItemResolver
	},
});

export const handle = createHttpHandle();
