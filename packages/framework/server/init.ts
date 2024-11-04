export const init = (
	settings: {
		port: number;
		hostname: string;
		env: "local" | "production";
	},
	handler: (req: Request) => Promise<Response>,
) => {
	if (settings.env === "production") {
		Deno.serve(
			{
				port: settings.port,
				hostname: settings.hostname,
			},
			handler,
		);
	}

	Deno.serve(
		{
			port: settings.port,
			hostname: settings.hostname,
		},
		async (req) => {
			const { pathname } = new URL(req.url);

			console.log(req.headers.get("upgrade"));
			console.log(req.url);
			if (pathname === "/ws") {
				const { response } = Deno.upgradeWebSocket(req);
				return response;
			}

			// Handle regular HTTP requests
			let response = await handler(req);

			// Check if response contains HTML to determine if reload script should be injected
			if (
				settings.env === "local" &&
				response.headers.get("Content-Type") === "text/html"
			) {
				const html = await response.text();
				if (html.includes("<html") || html.includes("<!DOCTYPE html")) {
					// Inject WebSocket script for reload functionality
					const modifiedHtml = html.replace(
						"</body>",
						`<script>
                const ws = new WebSocket('ws://' + location.host + '/ws');
                ws.onclose = () => setInterval(() => location.reload(), 50);
              </script></body>`,
					);
					response = new Response(modifiedHtml, {
						headers: response.headers,
					});
				}
			}

			return response;
		},
	);
};
