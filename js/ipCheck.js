(function () {
    "use strict";

    const versionBtn = document.getElementById("ip-version-btn");
    const versionMenu = document.getElementById("ip-version-menu");
    const versionLabel = document.getElementById("ip-version-label");
    const versionChevron = document.getElementById("ip-version-chevron");

    const ipInput = document.getElementById("ip-input");
    const checkBtn = document.getElementById("ip-check-btn");
    const checkBtnLabel = document.getElementById("ip-check-btn-label");
    const errorEl = document.getElementById("ip-error");

    const resultsEl = document.getElementById("ip-results");
    const resultsTitle = document.getElementById("ip-results-title");
    const resultsJson = document.getElementById("ip-results-json");
    const resultsDismiss = document.getElementById("ip-results-dismiss");
    const copyJsonBtn = document.getElementById("ip-copy-json-btn");

    const apiBaseUrl = "https://api.gteam.cloud/coralgate";
    const menuTransitionMs = 150;

    let selectedVersion = "v2";
    let isChecking = false;
    let lastResult = null;

    function openVersionMenu() {

        versionMenu.classList.remove("hidden");

        requestAnimationFrame(() => {
            versionMenu.classList.remove("opacity-0", "scale-95", "pointer-events-none");
            versionMenu.classList.add("opacity-100", "scale-100");
        });

        versionChevron.classList.add("rotate-180");

    }

    function closeVersionMenu() {

        versionMenu.classList.remove("opacity-100", "scale-100");
        versionMenu.classList.add("opacity-0", "scale-95", "pointer-events-none");
        versionChevron.classList.remove("rotate-180");

        setTimeout(() => {
            versionMenu.classList.add("hidden");
        }, menuTransitionMs);

    }

    function toggleVersionMenu() {

        const isOpen = !versionMenu.classList.contains("hidden");

        if (isOpen) {
            closeVersionMenu();
        } else {
            openVersionMenu();
        }

    }

    function selectVersion(opt) {

        selectedVersion = opt.getAttribute("data-version");
        versionLabel.textContent = selectedVersion;
        closeVersionMenu();

        versionMenu.querySelectorAll("[data-version]").forEach((o) => {

            o.classList.remove("bg-[#165193]/10", "text-[#165193]", "font-semibold");
            o.classList.add("text-black/70", "font-medium");

        });

        opt.classList.remove("text-black/70", "font-medium");
        opt.classList.add("bg-[#165193]/10", "text-[#165193]", "font-semibold");

    }

    if (versionBtn && versionMenu) {

        versionBtn.addEventListener("click", (e) => {

            e.stopPropagation();
            toggleVersionMenu();

        });

        versionMenu.querySelectorAll("[data-version]").forEach((opt) => {
            opt.addEventListener("click", () => selectVersion(opt));
        });

        document.addEventListener("click", (e) => {

            if (!versionMenu.classList.contains("hidden") && !e.target.closest("#ip-version-dropdown")) {
                closeVersionMenu();
            }

        });

    }

    function isValidIPv4(str) {

        if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(str)) {
            return false;
        }

        return str.split(".").every((part) => Number(part) <= 255);

    }

    // Loose check, good enough to catch obvious typos before hitting the API.
    function isValidIPv6(str) {
        return str.includes(":") && /^[0-9a-fA-F:]+$/.test(str) && str.split(":").length <= 8;
    }

    function isValidIp(str) {
        return isValidIPv4(str) || isValidIPv6(str);
    }

    function showError(message) {

        errorEl.textContent = message;
        errorEl.classList.remove("hidden");

    }

    function clearError() {

        errorEl.classList.add("hidden");
        errorEl.textContent = "";

    }

    function setLoading(loading) {

        isChecking = loading;
        checkBtn.disabled = loading;
        checkBtnLabel.textContent = loading ? "Checking…" : "Check";

    }

    function syntaxHighlight(json) {

        // Turns JSON.stringify's output into small colored spans, keys, strings, numbers, booleans and null each get their own color.
        const escaped = json
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        return escaped.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|\bnull\b|-?\d+(\.\d+)?([eE][+-]?\d+)?)/g,
            (match) => {

                let cls = "text-orange-600"; // Number.

                if (/^"/.test(match)) {
                    cls = /:$/.test(match) ? "text-[#165193] font-semibold" : "text-emerald-700"; // Key vs string.
                } else if (/true|false/.test(match)) {
                    cls = "text-violet-600";
                } else if (/null/.test(match)) {
                    cls = "text-black/40";
                }

                return `<span class="${cls}">${match}</span>`;

            }

        );

    }

    function renderResults(ip, data) {

        resultsTitle.textContent = `Results for ${ip}`;
        resultsJson.innerHTML = syntaxHighlight(JSON.stringify(data, null, 2));
        resultsEl.classList.remove("hidden");

    }

    async function checkIp() {

        if (isChecking) {
            return;
        }

        const ip = ipInput.value.trim();
        clearError();

        if (!ip) {

            showError("Enter an IP address first.");
            return;

        }

        if (!isValidIp(ip)) {

            showError("That doesn't look like a valid IPv4 or IPv6 address.");
            return;

        }

        setLoading(true);
        resultsEl.classList.add("hidden");

        try {

            const res = await fetch(`${apiBaseUrl}/${selectedVersion}/${encodeURIComponent(ip)}`, { cache: "no-store" });

            if (!res.ok) {

                showError(`API responded with an error (HTTP ${res.status}).`);
                return;

            }

            const data = await res.json();
            lastResult = data;
            renderResults(ip, data);

        } catch (err) {

            console.error("IP check failed:", err);
            showError("The API didn't return a usable response — likely a CORS issue on the API side, check the console.");

        } finally {
            setLoading(false);
        }

    }

    if (checkBtn) {
        checkBtn.addEventListener("click", checkIp);
    }

    if (ipInput) {
        ipInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") checkIp();
        });
    }

    if (resultsDismiss) {
        resultsDismiss.addEventListener("click", () => {
            resultsEl.classList.add("hidden");
        });
    }

    if (copyJsonBtn) {

        copyJsonBtn.addEventListener("click", () => {

            if (!lastResult) {
                return;
            }

            navigator.clipboard.writeText(JSON.stringify(lastResult, null, 2));

            const originalContent = copyJsonBtn.innerHTML;

            copyJsonBtn.innerHTML = `
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Copied!</span>
            `;

            setTimeout(() => {
                copyJsonBtn.innerHTML = originalContent;
            }, 2000);

        });

    }

})();
