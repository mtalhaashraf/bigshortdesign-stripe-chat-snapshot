import { writable } from "svelte/store";

export const layoutConfig = writable({
    sidebarShow: true,
    chatbarShow: true,
    navbarId: "Website__navbar_xdLt49Qt",
    sidebarId: "Website__sidebar_xdLt49Qt",
    chatbarId: "Website__chatbar_xdLt49Qt"
});


export const togglingLayout = (content = "") => {
    try {
        const unSubscribe = layoutConfig.subscribe((value) => {
            const body = document.body;
            const isSmallDevice = window.innerWidth < 992
            const toggleBodyClass = (_classes = "") => _classes.split(" ").forEach((c) => body.classList.toggle(c))
            const bodyHasClass = _class => body.classList.contains(_class)
            const addingMobileClass = (_class) => {
                if (body.className === _class || !body.className) toggleBodyClass(_class)
                else if (body.className !== _class) {
                    body.className = ""
                    body.classList.add(_class)
                } else {
                    body.className = ""
                }

            }
            // adding Class by specific Layout

            if (content === value.sidebarId) {
                !isSmallDevice ? toggleBodyClass("sidebar-notexpended") : addingMobileClass("sidebar-open")
            } else if (content === value.chatbarId) {
                !isSmallDevice ? toggleBodyClass('chat-notexpended') : addingMobileClass("chat-open")
            } else if (content === "minimize-all" && !isSmallDevice ) {
                if (!bodyHasClass('chat-notexpended') || !bodyHasClass("sidebar-notexpended")) {
                    body.classList.add("chat-notexpended", "sidebar-notexpended", "sidebar-open")
                } else {
                    toggleBodyClass("chat-notexpended sidebar-notexpended")
                }
            }
        })
        unSubscribe()

    } catch (e) {
        console.error(e)
    }
} 