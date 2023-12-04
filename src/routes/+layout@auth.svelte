<script>
	import Chatbar from './../shared/Chatbar.svelte';
	import Navbar from './../shared/Navbar.svelte';
	import Sidebar from './../shared/Sidebar.svelte';

	import { layoutConfig } from './../store/layout_config.js';

	let selectedClass = '';
	let count = 1;

	$: {
		if (!$layoutConfig.sidebarShow && $layoutConfig.chatbarShow) {
			selectedClass = isMobile() ? 'sidebar-open' : 'sidebar-notexpended';
		} else if (!$layoutConfig.chatbarShow && $layoutConfig.sidebarShow) {
			selectedClass = 'chat-notexpended chat-open';
		} else if (!$layoutConfig.sidebarShow && !$layoutConfig.chatbarShow) {
			selectedClass = isMobile() ? '' : 'sidebar-n-chat-notexpended';
		} else {
			selectedClass = 'a';
		}
	}

	const isMobile = () => {
		return window.innerWidth <= 992;
	};
</script>

<!-- Svelte Header -->
<svelte:head>
	<title>Bigshort Dashboard</title>
</svelte:head>

<div>
	<Navbar />
	<Sidebar />
	<Chatbar />
	<div class="main-content">
		<slot />
	</div>
</div>
