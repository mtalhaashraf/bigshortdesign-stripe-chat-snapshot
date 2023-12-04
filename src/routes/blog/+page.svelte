<script>
	import routes from '../../routes';

	export let data;
</script>

<div class="blog-section boxed-layout blog-page">
	<div class="blog-list">
		<div class="row">
			{#each data.blogs as blog}
				<div class="col-xl-4 col-lg-6">
					<div class="boxed-layout-60">
						<p class="title">{blog.title}</p>
						<p class="h-5" style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis">
							{@html blog.description}
						</p>
						<div class="footer">
							<p class="date">{new Date(blog.createdAt).toDateString()}</p>
							<a href={routes.blogByID(blog.id)}>Read More</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
</style>
