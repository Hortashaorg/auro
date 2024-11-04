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

	if (settings.env === "local") {
		Deno.serve(
			{
				port: settings.port,
				hostname: settings.hostname,
			},
			async (req) => {
				const { pathname } = new URL(req.url);

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
					if (
						html.includes("<html") ||
						html.includes("<!DOCTYPE html")
					) {
						// Inject WebSocket script for reload functionality
						const modifiedHtml = html.replace(
							"</body>",
							`
							<script>
							const getThemePreference = () => {
								if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
								return localStorage.getItem('theme');
								}
								return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
							};
							const isDark = getThemePreference() === 'dark';
							document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
							
							if (typeof localStorage !== 'undefined') {
								const observer = new MutationObserver(() => {
								const isDark = document.documentElement.classList.contains('dark');
								localStorage.setItem('theme', isDark ? 'dark' : 'light');
								});
								observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
							}
							
							document.addEventListener('alpine:init', () => {
								Alpine.data('themeData', () => ({
									isDarkMode: document.documentElement.classList.contains('dark'),
									
									themeToggle() {
										this.isDarkMode = !this.isDarkMode;
										document.documentElement.classList.toggle('dark', this.isDarkMode);
									}
								}));
							});
							</script>
							<script>
								const ws = new WebSocket('ws://' + location.host + '/ws');
								ws.onclose = () => setInterval(() => location.reload(), 50);
							</script>
							</body>`,
						);
						response = new Response(modifiedHtml, {
							headers: response.headers,
						});
					}
				}

				return response;
			},
		);
	}
};
