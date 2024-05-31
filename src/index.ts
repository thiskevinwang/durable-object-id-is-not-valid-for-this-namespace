import { DurableObject } from 'cloudflare:workers';

interface Env {
	MY_DURABLE_OBJECT: DurableObjectNamespace<MyDurableObject>;
}

export class MyDurableObject extends DurableObject {
	async sayHello(name: string): Promise<string> {
		return `Hello, ${name}!`;
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		let idString = new URL(request.url).pathname.replace(/^\//, '');
		let id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromString(idString); // This line throws an error.
		let stub = env.MY_DURABLE_OBJECT.get(id);
		let greeting = await stub.sayHello('world');
		return new Response(greeting);
	},
};
