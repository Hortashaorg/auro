function handleViewTransition(event, transitionFn) {
  event.preventDefault();

  if (document.startViewTransition) {
    document.startViewTransition(() => transitionFn(event));
  } else {
    transitionFn(event);
  }
}

globalThis.viewTransition = handleViewTransition;

globalThis.addEventListener("popstate", (_event) => {
  console.log("popstate");
  const href = document.location.href;

  // Optional: use startViewTransition on back too
  if (document.startViewTransition) {
    document.startViewTransition(() => fetchAndReplace(href));
  } else {
    fetchAndReplace(href);
  }
});

async function fetchAndReplace(href) {
  const res = await fetch(href);
  const html = await res.text();
  const dom = new DOMParser().parseFromString(html, "text/html");

  const newContent = dom.querySelector("#main");
  const newTitle = dom.querySelector("title")?.innerText;

  if (newContent) document.querySelector("#main")?.replaceWith(newContent);
  if (newTitle) document.title = newTitle;

  htmx.process(document.body);
}
