<script>
	import { auth } from '$lib/firebase';
	import { onMount } from 'svelte';
	import light_theme_css from '../data/theme-css.json';
	import { user } from '../store/user';
	import { layoutConfig, togglingLayout } from './../store/layout_config.js';
	import Announcement from '../shared/Announcement.svelte';
	import { equals, includes, prop } from 'ramda';

	let profileActive = false;
	let lightTheme = false;
	let announcements;
	let announcIds = [];

	const handleLogout = () => {
		console.log('Logged out');
		auth.logout();
	};

	const handleAnnoucementClose = ({ detail: { id } }) => {
		const announs = localStorage.getItem('announs');
		if (announs) {
			let ids = JSON.parse(announs);
			localStorage.setItem('announs', JSON.stringify([...ids, id]));
		} else localStorage.setItem('announs', JSON.stringify([id]));

		announcements = announcements?.filter((e) => !equals(id, e.id));
	};

	onMount(async () => {
		const announs = localStorage.getItem('announs');
		if (announs) announcIds = JSON.parse(announs);
		announcements = await fetch('/api/announcements/get')
			.then((res) => res.json())
			.then(prop('announcements'))
			.then((docs) =>
				docs.length && announcIds.length ? docs.filter((e) => !includes(e.id, announcIds)) : docs
			);

		console.log(announcements);

		window.addEventListener('touch', () => {
			if (!isSideBarOpenMbl) {
				sideBarMbl();
			}
		});

		lightTheme = JSON.parse(localStorage.getItem('lighttheme'));
		if (lightTheme) {
			const styleTag = document.getElementById('theme-toggle');
			styleTag.innerText = light_theme_css.text;
		}
	});

	const toggleTheme = () => {
		const styleTag = document.getElementById('theme-toggle');
		if (styleTag?.innerText !== light_theme_css.text) {
			styleTag.innerText = light_theme_css.text;
			localStorage.setItem('lighttheme', true);
			lightTheme = true;
		} else {
			styleTag.innerText = '';
			localStorage.setItem('lighttheme', false);
			lightTheme = false;
		}
	};
</script>

<header class="page-header" id={$layoutConfig.navbarId}>
	<div class="left-side">
		<div class="menu-icon" on:click={() => togglingLayout($layoutConfig.sidebarId)}>
			<i class="icofont-navigation-menu" id="sideBarMbl" />
		</div>
		{#if !lightTheme}
			<div class="branding">
				<a href="http://app.bigshort.com"><img src="/assets/images/logo.png" alt="BigShort" /></a>
			</div>
		{:else}
			<div class="branding">
				<a href="http://app.bigshort.com"
					><img src="/assets/images/lightlogo.png" alt="BigShort" /></a
				>
			</div>
		{/if}
	</div>
	<!-- Announcements -->
	{#if announcements?.length && announcements?.length > 0}
		<Announcement on:close={handleAnnoucementClose} announcement={announcements?.shift()} />
	{/if}
	<!--  -->
	<div class="right-side">
		<div class="icon-nav">
			<div class="nav" on:click={() => togglingLayout('minimize-all')}>
				<!-- <i class="icofont-exchange" on:click={minimizeAll} /> -->
				<i class="icofont-exchange" />
			</div>
			<div class="nav">
				<i class="icofont-light-bulb" id="changeTheme" on:click={toggleTheme} />
			</div>
			<div class="nav">
				<i class="icofont-comment" on:click={() => togglingLayout($layoutConfig.chatbarId)} />
				<!-- <i class="icofont-comment" on:click={() => layoutConfig.update((prev) => ({ ...prev, chatbarShow: !prev.chatbarShow }))} /> -->
			</div>
		</div>
		<div class="profile-detail" on:click|self={() => (profileActive = !profileActive)}>
			<div class="headshot" on:click={() => (profileActive = !profileActive)}>
				<img
					src={$user.photoURL || '/assets/images/default-profile-pic.png'}
					alt="profile-headshot"
					width="25"
					height="25"
				/>
			</div>
			<!-- <div class="profile-name">{(authUser && authUser.email.split('@')[0]) || ''}</div> -->
			<div class="dropdown-profile" class:active={profileActive} id="dropdown-profile">
				<div class="list" on:click|stopPropagation={() => (profileActive = false)}>
					<a href="#"><i class="icofont-user-alt-7" /> Profile</a>
					<a href="#"><i class="icofont-gear" /> Settings</a>
					<a role="button" on:click={handleLogout}><i class="icofont-logout" /> Logout</a>
				</div>
			</div>
		</div>
	</div>
</header>
