import { createHttpHandle } from '$admin/router';
import { initializeAdmin } from '$admin/server';
import { CustomerEntity, CustomerResolver } from '$lib/customer/customer.entity';
import { MediaObjectEntity } from '$lib/media-object';
import { OrderItemResolver } from '$lib/order/order-item.entity';
import { OrderEntity, OrderResolver } from '$lib/order/order.entity';
import { ProductEntity } from '$lib/product/product.entity';

// Setup all admin data
initializeAdmin({
	schema: {
		customers: CustomerEntity,
		products: ProductEntity,
		orders: OrderEntity,
		mediaObjects: MediaObjectEntity,
	},

	resolvers: {
		Customer: CustomerResolver,
		Order: OrderResolver,
		OrderItem: OrderItemResolver
	},
});

export const handle = createHttpHandle();
