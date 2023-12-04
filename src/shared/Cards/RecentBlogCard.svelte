<script>
	import routes from '../../routes';
	export let blog;
</script>

<div class="boxed-layout-60">
	<p class="title">{blog.title || ''}</p>
	<div class="footer">
		<p class="date">{new Date(blog.createdAt).toDateString()}</p>
		<a href={routes.blogByID(blog.id)}>Read More</a>
	</div>
</div>
