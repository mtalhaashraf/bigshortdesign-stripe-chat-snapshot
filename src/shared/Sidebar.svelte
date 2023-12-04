<script>
    import { sidebarRoute } from "./../data/sidebar_router.js";
    import { layoutConfig, togglingLayout } from "./../store/layout_config.js";
    import { page } from "$app/stores";
</script>

<aside class="side-bar" id={$layoutConfig.sidebarId}>
    <!-- <div class="menu-icon" on:click={() => layoutConfig.update((prev) => ({ ...prev, sidebarShow: !prev.sidebarShow }))}> -->
    <div class="menu-icon" on:click={() => togglingLayout($layoutConfig.sidebarId)}>
        <svg width="8" height="17" viewBox="0 0 8 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.998933 9.79415L-4.02145e-07 7.8L2.87393 7.84559L4.74893 5.89704L6.62393 3.94848L7.49893 -3.27789e-07L8 2L8 17L0.998933 9.79415Z" fill="#081840" />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.62393 3.94848L2.87393 7.84559L-4.02145e-07 7.8L0.998933 9.79415L8 17L8 2L7.49893 -3.27789e-07L6.62393 3.94848ZM7 4.99987L3.29294 8.85237L1.63242 8.82602L1.82383 9.20812L7 14.5357L7 4.99987Z"
                fill="#1A326F"
            />
            <path d="M-3.40697e-07 7.79415L7.5 -7.75755e-05L7.5 15.5884L-3.40697e-07 7.79415Z" fill="#4ea3f6" />
        </svg>
    </div>
    <div class="site-navigation">
        <ul>
            {#each sidebarRoute as route}
                <li class:active={route.activePath === $page.url.pathname}>
                    <a href={route.path}>
                        <div class="icon">
                            <i class={route.icon} />
                        </div>
                        <span>{route.title}</span>
                    </a>
                </li>
            {/each}
        </ul>
    </div>
    <div class="favicon">
        <img src="/assets/images/favicon.png" alt="">
        <a href="#"></a>
    </div>
</aside>
