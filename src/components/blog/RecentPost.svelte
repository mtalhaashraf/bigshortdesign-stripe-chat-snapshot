<script>
	import RecentBlogCard from './../../shared/Cards/RecentBlogCard.svelte';
	export let blogs;
</script>

<div class="col-lg-4">
	<div class="blog-list">
		<p class="heading">Related posts</p>
		{#each blogs.slice(0, 3) as blog}
			<RecentBlogCard blog={blog} />
		{/each}
	</div>
</div>
