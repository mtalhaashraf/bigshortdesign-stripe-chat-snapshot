<script>
	import RecentPost from '../../../components/blog/RecentPost.svelte';
	import FullBlog from '../../../components/blog/FullBlog.svelte';

	export let data;
</script>

<div class="blog-section boxed-layout">
	<div class="row">
		<FullBlog blog={data.blog} />
		<RecentPost blogs={data.blogs} />
	</div>
</div>
