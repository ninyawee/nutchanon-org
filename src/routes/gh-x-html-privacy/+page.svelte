<svelte:head>
	<title>Privacy policy — gh-x-html</title>
	<meta
		name="description"
		content="Privacy policy for the gh-x-html Chrome extension. No data leaves the user's browser."
	/>
</svelte:head>

<article>
	<h1>Privacy policy — gh-x-html Chrome extension</h1>
	<p class="updated">Last updated: 2026-05-30</p>

	<p>
		The <code>gh-x-html</code> Chrome extension renders inline videos, audio, and sandboxed HTML inside
		GitHub comments. This page describes exactly what the extension reads, what it stores, and what it
		sends — which is very little.
	</p>

	<h2>What the extension stores</h2>
	<p>The extension stores a single value in <code>chrome.storage.sync</code>:</p>
	<ul>
		<li>
			<strong><code>trustedAuthors</code></strong> — an array of GitHub login strings (e.g.
			<code>["ninyawee", "alice", "bob"]</code>). This is the per-user allowlist that decides which
			comment authors get their media links and <code>x-html</code> fences rewritten. It is seeded on
			first install with your own GitHub login, read from the
			<code>&lt;meta name="user-login"&gt;</code> element on github.com. You can add or remove logins
			through the extension popup.
		</li>
	</ul>
	<p>
		Because <code>chrome.storage.sync</code> is synced by your signed-in Chrome profile, the same
		allowlist follows you across the browsers where you're signed in with the same Google account.
		Google's <code>chrome.storage.sync</code> mechanism is the only thing that touches your allowlist
		server-side — the gh-x-html extension itself does not send your allowlist anywhere.
	</p>
	<p>The extension does <strong>not</strong> store, log, or transmit:</p>
	<ul>
		<li>the contents of any GitHub comment, fence, or media URL</li>
		<li>your GitHub username (beyond seeding the allowlist on first install)</li>
		<li>any analytics, telemetry, error reports, or usage data</li>
		<li>any other field from <code>chrome.storage</code> or <code>chrome.cookies</code></li>
	</ul>

	<h2>What the extension reads</h2>
	<p>
		When you visit a <code>github.com</code> page, the content script reads the visible DOM of comments
		to:
	</p>
	<ol>
		<li>find each comment's author login (via GitHub's existing DOM markup)</li>
		<li>check whether that login is in your local allowlist</li>
		<li>
			if it is, rewrite the comment's fenced <code>x-html</code> blocks into sandboxed
			<code>&lt;iframe&gt;</code> elements, and rewrite <code>.mp4</code> / <code>.webm</code> /
			<code>.mov</code> / <code>.mp3</code> / <code>.m4a</code> / <code>.ogg</code> URLs into
			<code>&lt;video&gt;</code> / <code>&lt;audio&gt;</code> players
		</li>
	</ol>
	<p>
		All of this runs locally in your browser. None of the comment content, author logins, or media
		URLs leaves the page.
	</p>

	<h2>What the extension sends over the network</h2>
	<p>Nothing.</p>
	<p>
		The extension makes no fetch calls, no XHR requests, no WebSocket connections, and no DNS lookups
		of its own. There is no analytics endpoint, no error-reporting endpoint, no update-check endpoint.
	</p>
	<p>
		The sandboxed <code>&lt;iframe&gt;</code> elements created by the extension may, of course, load
		images, fonts, CSS, or scripts from URLs the comment author typed into the fence (for example, a
		Pico CSS CDN link). That network activity is initiated by the iframe's own document — not by the
		extension — and runs inside an opaque-origin sandbox (no GitHub cookies, no parent-DOM access).
	</p>

	<h2>Permissions</h2>
	<p>The extension requests the minimum set of Chrome permissions needed to do the above:</p>
	<ul>
		<li><strong><code>storage</code></strong> — to read and write the <code>trustedAuthors</code> allowlist</li>
		<li>
			<strong><code>scripting</code></strong> — used once, inside the popup, to read your GitHub login
			from the active tab so the popup can show it to you
		</li>
		<li>
			<strong><code>activeTab</code></strong> — to identify the currently-focused GitHub tab for that
			one-shot read
		</li>
		<li>
			<strong><code>https://github.com/*</code></strong> (host permission) — required so the content
			script can run on GitHub pages and rewrite comment DOM
		</li>
	</ul>

	<h2>Third-party services</h2>
	<p>
		The extension does not integrate with any third-party service. <code>chrome.storage.sync</code> is
		provided by your own signed-in Chrome profile; that is Google's infrastructure, not ours.
	</p>

	<h2>Children</h2>
	<p>
		The extension is a developer tool with no audience-targeting or content of its own. It performs the
		same DOM rewriting regardless of who is using it.
	</p>

	<h2>Changes to this policy</h2>
	<p>
		This policy may be updated when the extension's data behavior changes. Material changes will be
		reflected in the "Last updated" date at the top of this page. The history of edits lives in the
		open-source repo:
		<a href="https://github.com/ninyawee/gh-x-html">github.com/ninyawee/gh-x-html</a>.
	</p>

	<h2>Contact</h2>
	<p>
		Source code, issues, and contact:
		<a href="https://github.com/ninyawee/gh-x-html">github.com/ninyawee/gh-x-html</a>. For other
		inquiries: <a href="mailto:life.particles@gmail.com">life.particles@gmail.com</a>.
	</p>
</article>

<style>
	article {
		padding-bottom: 2rem;
	}
	h1 {
		margin-bottom: 0.5rem;
	}
	h2 {
		margin-top: 2.5rem;
		margin-bottom: 0.75rem;
	}
	.updated {
		color: var(--color-text-muted);
		font-size: 0.95rem;
		margin-bottom: 2rem;
	}
	ul,
	ol {
		margin: 0 0 1rem 1.25rem;
	}
	li {
		margin-bottom: 0.5rem;
	}
</style>
