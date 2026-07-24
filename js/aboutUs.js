(function () {
    "use strict";

    // Milestones/steps.
    const ITEMS = [
        { year: "2019", title: "Beginning", desc: "XIII started \"coding\" using Skript on Minecraft.",
            icon: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>' },
        { year: "2020", title: "First Server", desc: "First public Minecraft server, FishFisher.",
            icon: '<rect x="3" y="4" width="18" height="7" rx="1"/><rect x="3" y="13" width="18" height="7" rx="1"/><line x1="7" y1="7.5" x2="7" y2="7.5" stroke-width="2.5"/><line x1="7" y1="16.5" x2="7" y2="16.5" stroke-width="2.5"/>' },
        { year: "2021", title: "First Anticheat", desc: "First public Minecraft Anticheat, GUARD (Skript).",
            icon: '<path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6l7-3z"/>' },
        { year: "2021", title: "Vagdedes2's Arrival", desc: "Vagdedes2 helps code advanced checks for GUARD and other server projects.",
            icon: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6"/><line x1="17" y1="8" x2="17" y2="14"/><line x1="14" y1="11" x2="20" y2="11"/>' },
        { year: "2022", title: "Java Beginnings", desc: "GUARD is ported over in Java, multiple versions exist with each attempt.",
            icon: '<path d="M6 8h11a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z"/><path d="M17 9h1a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-1"/><path d="M8 3c0 1-1 1-1 2M11 3c0 1-1 1-1 2"/>' },
        { year: "2022", title: "GTeam's Creation", desc: "GTeam is created for an experimental anticheat (Vengeance).<br>"
                + "XIII: com.gteam.vengeance ??<br>"
                + "XIII: gteam = guard team<br>"
                + "12/3/22, 18:07",
            icon: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>' },
        { year: "2023", title: "Commissioned By Servers", desc: "Making the main plugin, Anticheat and game launcher for a Minecraft RolePlay modded server.",
            icon: '<path d="M12 2c3 2 5 6 5 10 0 2-1 4-2 5l-1-3-2 2-2-2-1 3c-1-1-2-3-2-5 0-4 2-8 5-10z"/><circle cx="12" cy="9" r="1.5"/>' },
        { year: "2024", title: "Commissioned By Servers", desc: "Our biggest project yet for a Zombie apocalypse modded Minecraft server. Main plugin with near 900 commits in less than a year.",
            icon: '<circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/>' },
        { year: "2025", title: "VPN Setup Script", desc: "A now private and archived VPN server (WireGuard and OpenVPN) setup script for Linux.",
            icon: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>' },
        { year: "2025", title: "Wave Anticheat", desc: "A cross version (1.8.x - 1.21.x), cross platform (Java and Bedrock) anticheat. Now private and archived due to the weight and complexity of the project.",
            icon: '<path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/>' },
        { year: "2025", title: "GTeam's Cloud", desc: "A simple to use, large and fast ISO provider originally made for classmates.",
            icon: '<path d="M6.5 19a4.5 4.5 0 0 1-1-8.9A5.5 5.5 0 0 1 16 7a4 4 0 0 1 1.5 7.9"/><path d="M7 19h10"/>' },
        { year: "2025", title: "CoralGate", desc: "An application firewall for Minecraft servers and networks. Protecting, detecting and blocking server scanners.",
            icon: '<path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6l7-3z"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>' },
        { year: "2025", title: "GTeam's API", desc: "In direct link and pair with CoralGate. Provides global threat intelligence, risk assessment and IP informative API.",
            icon: '<circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z"/>' },
        { year: "2026", title: "Today", desc: "Still actively developing, maintaining and contributing to CoralGate, GTeam's Cloud and API. New project coming soon! (maybe...)",
            icon: '<polyline points="3 12 7 12 9 6 13 18 15 12 21 12"/>' },
    ];

    // Layout.
    const CONFIG = {
        itemsPerRow: 3,
        vbWidth: 1000, // svg viewBox width.
        rowHeight: 300, // vertical distance between row lines.
        topMargin: 80, // y of the first row's line.
        bottomPad: 180, // extra space below the last row for its content.
        lineStart: 80, // x where the very first line begins.
        lineEnd: 920, // x where the very last line ends.
        turnRadius: 40, // corner radius at each turn.
        contentGap: 28, // px gap between the line and content block below it.
        startDotSize: 18, // px diameter of the true-round start marker (rendered as HTML, not SVG, so it can't be stretched).
        tailLength: 80, // how far the fading dashed "continues..." tail extends past the last item, in viewBox units. Matches the existing 80-unit margin so it fades out exactly at the edge.
    };

    // Creates snake path.
    function computeLayout(items, cfg) {

        const numRows = Math.ceil(items.length / cfg.itemsPerRow);
        const vbHeight = cfg.topMargin + (numRows - 1) * cfg.rowHeight + cfg.bottomPad;

        // Evenly spaced x positions within a row, inset from the line ends.
        const xPositions = [];
        for (let i = 0; i < cfg.itemsPerRow; i++) {

            xPositions.push(
                cfg.itemsPerRow === 1
                    ? cfg.vbWidth / 2
                    : 250 + (500 * i) / (cfg.itemsPerRow - 1)
            );

        }

        let d = "";
        let dir = "R"; // R = left-to-right, L = right-to-left.
        const positions = [];

        let lastRowFarX = cfg.lineStart;
        for (let row = 0; row < numRows; row++) {

            const y = cfg.topMargin + row * cfg.rowHeight;
            const isLastRow = row === numRows - 1;

            const itemsInThisRow = Math.min(cfg.itemsPerRow, items.length - row * cfg.itemsPerRow);
            const lastItemCol = itemsInThisRow - 1;
            const lastItemX = dir === "R" ? xPositions[lastItemCol] : xPositions[cfg.itemsPerRow - 1 - lastItemCol];

            const farX = dir === "R"
                ? (isLastRow ? lastItemX : cfg.lineEnd - cfg.turnRadius)
                : (isLastRow ? lastItemX : cfg.lineStart + cfg.turnRadius);

            if (isLastRow) {
                lastRowFarX = farX;
            }

            d += (row === 0 ? `M${dir === "R" ? cfg.lineStart : cfg.lineEnd},${y} ` : "") + `L${farX},${y} `;

            // Item positions for this row, in travel order.
            for (let col = 0; col < cfg.itemsPerRow; col++) {

                const idx = row * cfg.itemsPerRow + col;
                if (idx >= items.length) {
                    break;
                }

                const x = dir === "R" ? xPositions[col] : xPositions[cfg.itemsPerRow - 1 - col];
                positions.push({ x, y });

            }

            if (!isLastRow) {

                const turnX = dir === "R" ? cfg.lineEnd : cfg.lineStart;
                const nextInX = dir === "R" ? cfg.lineEnd - cfg.turnRadius : cfg.lineStart + cfg.turnRadius;
                d += `Q${turnX},${y} ${turnX},${y + cfg.turnRadius} `;
                d += `L${turnX},${y + cfg.rowHeight - cfg.turnRadius} `;
                d += `Q${turnX},${y + cfg.rowHeight} ${nextInX},${y + cfg.rowHeight} `;
                dir = dir === "R" ? "L" : "R";

            }

        }

        const startPos = { x: cfg.lineStart, y: cfg.topMargin };
        const endPos = positions.length
            ? { x: lastRowFarX, y: cfg.topMargin + (numRows - 1) * cfg.rowHeight }
            : startPos;

        // endDir: direction of travel at the very end, used to know which
        // way the fading "continues..." tail should point.
        return { d, vbHeight, positions, startPos, endPos, endDir: dir };

    }

    // Fewer items per row on narrower viewports so content blocks never get crowded together.
    function getItemsPerRow() {

        const w = window.innerWidth;
        if (w < 500) {
            return 1;
        }

        if (w < 900) {
            return 2;
        }

        return 3;

    }

    // Renderer the milestones/steps.
    function renderItem(item, pos, index, cfg) {

        const leftPct = ((pos.x / cfg.vbWidth) * 100).toFixed(2) + "%";
        const topPx = pos.y;
        const isBlue = index % 2 === 0;
        const pillClasses = isBlue ? "bg-[#165193]" : "bg-emerald-500";
        const iconRing = isBlue ? "border-[#165193] text-[#165193]" : "border-emerald-500 text-emerald-600";

        return `
            <div class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${pillClasses} text-white text-xs font-bold px-4 py-1.5 shadow-md whitespace-nowrap z-10"
                 style="left:${leftPct}; top:${topPx}px;">${item.year}</div>
            <div class="absolute -translate-x-1/2 w-44 sm:w-48 text-center"
                 style="left:${leftPct}; top:${topPx + cfg.contentGap}px;">
                <div class="w-11 h-11 mx-auto mb-2 rounded-full bg-white border-2 ${iconRing} flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
                </div>
                <h4 class="font-grotesk font-bold text-[15px]">${item.title}</h4>
                <p class="text-black/60 text-[13px] leading-snug">${item.desc}</p>
            </div>`;

    }

    function render() {

        // No timeline on this page, nothing to do.
        const container = document.getElementById("snake-timeline");
        if (!container) {
            return;
        }

        CONFIG.itemsPerRow = getItemsPerRow();
        const { d, vbHeight, positions, startPos, endPos, endDir } = computeLayout(ITEMS, CONFIG);
        container.style.height = vbHeight + "px";

        const nodesHtml = ITEMS.map((item, i) => renderItem(item, positions[i], i, CONFIG)).join("");

        // True-round start dot, rendered as HTML (not SVG) so the SVG's
        // preserveAspectRatio="none" stretching can't turn it into an ellipse.
        const startLeftPct = ((startPos.x / CONFIG.vbWidth) * 100).toFixed(2) + "%";
        const startDotHtml = `
            <div class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#165193] z-10"
                 style="left:${startLeftPct}; top:${startPos.y}px; width:${CONFIG.startDotSize}px; height:${CONFIG.startDotSize}px;"></div>`;

        // Fading dashed tail past the last item, hinting the timeline continues.
        const tailX = endDir === "R"
            ? Math.min(endPos.x + CONFIG.tailLength, CONFIG.vbWidth)
            : Math.max(endPos.x - CONFIG.tailLength, 0);

        container.innerHTML = `
            <svg viewBox="0 0 ${CONFIG.vbWidth} ${vbHeight}" preserveAspectRatio="none" class="absolute inset-0 w-full h-full">
                <defs>
                    <linearGradient id="snakeTailFade" gradientUnits="userSpaceOnUse" x1="${endPos.x}" y1="${endPos.y}" x2="${tailX}" y2="${endPos.y}">
                        <stop offset="0%" stop-color="#165193" stop-opacity="0.85" />
                        <stop offset="100%" stop-color="#165193" stop-opacity="0" />
                    </linearGradient>
                </defs>
                <path d="${d}" fill="none" stroke="#165193" stroke-width="6" stroke-linecap="round" opacity="0.85" />
                <line x1="${endPos.x}" y1="${endPos.y}" x2="${tailX}" y2="${endPos.y}"
                      stroke="url(#snakeTailFade)" stroke-width="6" stroke-linecap="round" stroke-dasharray="14 12" />
            </svg>
            ${startDotHtml}
            ${nodesHtml}
        `;

    }

    let resizeTimer;
    window.addEventListener("resize", () => {
        // Debounced — re-lay-out the snake if the breakpoint changes
        // (window resize, or phone rotation).
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(render, 150);
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", render);
    } else {
        render();
    }

})();
