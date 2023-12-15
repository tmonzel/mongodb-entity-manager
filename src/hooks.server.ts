import { initializeAdmin } from '$admin/boot.server';
import { createHttpHandle } from '$admin/router';
import { CustomerEntity } from '$lib/customer/customer.entity';
import { CustomerResolver } from '$lib/customer/customer.resolver';
import { MediaObjectEntity } from '$lib/media-object';
import { OrderItemResolver } from '$lib/order/order-item.resolver';
import { OrderEntity } from '$lib/order/order.entity';
import { OrderResolver } from '$lib/order/order.resolver';
import { ProductEntity } from '$lib/product/product.entity';

// Setup all admin data
initializeAdmin({
	customers: CustomerEntity,
	products: ProductEntity,
	orders: OrderEntity,
	mediaObjects: MediaObjectEntity,
}, {
	'Customer': CustomerResolver,
	'Order': OrderResolver,
	'OrderItem': OrderItemResolver
});

export const handle = createHttpHandle();
