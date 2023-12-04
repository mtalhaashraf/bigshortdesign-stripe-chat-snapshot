<script>
  export let blog
</script>

<div class="col-lg-8">
  <div class="recent-post">
    <h2 class="blog-title">
      {blog.title}
    </h2>
    {@html blog.description}
  </div>
</div>
