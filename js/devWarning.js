(function () {
    "use strict";

    // Check if current domain is not main production domain.
    const hostname = window.location.hostname;
    if (hostname !== "gteam.cloud" && hostname !== "www.gteam.cloud") {

        const devBanner = document.getElementById("dev-banner");
        const commitHashEl = document.getElementById("dev-commit-hash");

        if (devBanner) {
            devBanner.classList.remove("hidden");
        }

        alert(
            "DEVELOPMENT BUILD. NOT FOR USE OR PRODUCTION. ALL RIGHTS RESERVED.\n\n" +
            "ANY BUG/TYPO/DESIGN ISSUE SHOULD BE REPORTED VIA GITHUB.\n\n" +
            "https://github.com/GTeamX/GTeam.cloud/issues"
        );

        console.warn("DEVELOPMENT BUILD. NOT FOR USE OR PRODUCTION. ALL RIGHTS RESERVED.");
        console.warn("ANY BUG/TYPO/DESIGN ISSUE SHOULD BE REPORTED VIA GITHUB.");
        console.warn("https://github.com/GTeamX/GTeam.cloud/issues");

        // Fetch the latest short commit hash from GitHub's API for the 'dev' branch.
        fetch("https://api.github.com/repos/GTeamX/GTeam.cloud/commits/dev")
            .then((response) => (response.ok ? response.json() : Promise.reject()))
            .then((data) => {

                // Get short SHA (first 7 characters).
                if (data && data.sha && commitHashEl) {
                    commitHashEl.textContent = data.sha.substring(0, 7);
                }

            })
            // Quietly falls back to the default hardcoded commit in HTML if offline/rate-limited
            .catch(() => {});

    }

})();
