(function () {
    "use strict";

    function init() {

        const toggle = document.getElementById("mobile-menu-toggle");
        const menu = document.getElementById("mobile-menu");
        const iconOpen = document.getElementById("mobile-menu-icon-open");
        const iconClose = document.getElementById("mobile-menu-icon-close");

        if (!toggle || !menu) {
            return;
        }

        // Classes for the two states. max-h needs to comfortably fit the menu's full content — bump it if you add more links later.
        const CLOSED_CLASSES = ["max-h-0", "opacity-0", "border-transparent"];
        const OPEN_CLASSES = ["max-h-[420px]", "opacity-100", "border-white/10"];

        function setOpen(isOpen) {

            if (isOpen) {
                menu.classList.remove(...CLOSED_CLASSES);
                menu.classList.add(...OPEN_CLASSES);
            } else {
                menu.classList.remove(...OPEN_CLASSES);
                menu.classList.add(...CLOSED_CLASSES);
            }

            if (iconOpen) {
                iconOpen.classList.toggle("hidden", isOpen);
            }

            if (iconClose) {
                iconClose.classList.toggle("hidden", !isOpen);
            }

            toggle.setAttribute("aria-expanded", String(isOpen));

        }

        toggle.addEventListener("click", () => {
            setOpen(menu.classList.contains("max-h-0"));
        });

        // Close whenever a link inside the menu is tapped.
        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setOpen(false));
        });

        // Don't leave it stuck open if the viewport crosses back to desktop.
        window.addEventListener("resize", () => {

            if (window.innerWidth >= 768) {
                setOpen(false);
            }

        });

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
