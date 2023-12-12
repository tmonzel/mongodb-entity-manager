import { initTRPC } from '@trpc/server';

export const t = initTRPC.create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const createRouter = t.router;
export const publicProcedure = t.procedure;

