export function scopePerRequest(container) {
	return async (ctx, next) => {
		if (!ctx.state) {
			ctx.state = {};
		}
		ctx.state.container = container.createScope();
		try {
			return await next();
		} finally {
			ctx.state.container.dispose();
		}
	};
}
