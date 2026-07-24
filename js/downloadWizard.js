(function () {
    "use strict";

    const WIZARDS = {

        windows: {
            title: "Download Windows",
            steps: [
                {
                    key: "version",
                    question: "What version do you want ?",
                    options: [
                        { label: "Windows 11", value: "11", recommended: true },
                        { label: "Windows 10", value: "10" },
                    ],
                },
                {
                    key: "language",
                    question: "What language do you want ?",
                    options: [
                        { label: "English (United States)", value: "en-US", recommended: true },
                        { label: "Français (France)", value: "fr-FR" },
                    ],
                },
                {
                    key: "edition",
                    question: "What edition do you want ?",
                    options: [
                        { label: "Consumer", value: "Consumer", recommended: true },
                        { label: "Business", value: "Business" },
                    ],
                },
                {
                    key: "architecture",
                    question: "What architecture do you want ?",
                    options: [
                        { label: "x64", value: "x64", recommended: true },
                        { label: "ARM64", value: "arm64", showIf: (answers) => answers.version === "11" },
                    ],
                }
            ],

            baseUrl: "http://localhost:63342/GTeam.cloud/cloud/iso/", // TODO: change
            manifestUrl: "http://localhost:63342/GTeam.cloud/cloud/manifest.json", // TODO: change
            filePattern: "^Windows_{version}_{language}_{architecture}_{edition}_.*\\.iso$"

        },

        windows_server: {
            title: "Download Windows Server",
            steps: [
                {
                    key: "version",
                    question: "What version do you want ?",
                    options: [
                        { label: "Windows Server 2025", value: "2025" },
                        { label: "Windows Server 2022", value: "2022", recommended: true },
                        { label: "Windows Server 2019", value: "2019" },
                    ],
                },
                {
                    key: "language",
                    question: "What language do you want ?",
                    options: [
                        { label: "English (United States)", value: "en-US", recommended: true },
                        { label: "Français (France)", value: "fr-FR" },
                    ],
                },
                {
                    key: "architecture",
                    question: "What architecture do you want ?",
                    options: [
                        { label: "x64", value: "x64", recommended: true },
                    ],
                }
            ],

            manifestUrl: "http://localhost:63342/GTeam.cloud/cloud/manifest.json", // TODO: change
            baseUrl: "http://localhost:63342/GTeam.cloud/cloud/iso/", // TODO: change
            filePattern: "^windows-server_{version}_{language}_{architecture}_.*\\.iso$"

        }

    };

    const TRANSITION_MS = 300;
    const NEXT_COLOR_CLASSES = ["bg-[#165193]", "hover:bg-[#124278]", "border-[#165193]"];
    const DOWNLOAD_COLOR_CLASSES = ["bg-emerald-500", "hover:bg-emerald-600", "border-emerald-500"];

    let wizard = null;
    let stepIndex = 0;
    let answers = {};
    let manifestData = null;
    let manifestError = null;
    let isLoadingManifest = false;

    let overlay, backdrop, dialog, closeBtn, backBtn, nextBtn;
    let progressEl, titleEl, questionEl, bodyEl, statusEl;
    let nextLabelEl, nextIconArrow, nextIconDownload;

    function visibleOptions(step) {
        return step.options.filter((opt) => typeof opt.showIf !== "function" || opt.showIf(answers));
    }

    function isSummaryStep() {
        return stepIndex >= wizard.steps.length;
    }

    function currentStep() {
        return wizard.steps[stepIndex];
    }

    function truncateMiddleless(text, max = 32) {
        return text.length > max ? text.slice(0, max) + "..." : text;
    }

    function renderProgress() {

        const total = wizard.steps.length + 1;

        progressEl.innerHTML = "";
        for (let i = 0; i < total; i++) {

            const dot = document.createElement("span");
            const isActive = i === stepIndex;
            const isDone = i < stepIndex;

            dot.className = "w-2.5 h-2.5 rounded-full transition-colors " +
                (isActive ? "bg-[#165193]" : isDone ? "bg-[#165193]/50" : "bg-black/15");
            progressEl.appendChild(dot);
        }

    }

    function renderOptionButtons(step) {

        bodyEl.innerHTML = "";
        visibleOptions(step).forEach((opt) => {

            const btn = document.createElement("button");
            btn.type = "button";

            const isSelected = answers[step.key] === opt.value;
            btn.className = "w-full flex items-center justify-between gap-3 px-5 py-3 rounded-lg font-medium text-left transition-all duration-150 border-2 "
                + (isSelected
                    ? "bg-[#165193] border-[#165193] text-white shadow-sm"
                    : "bg-white border-[#165193]/25 text-[#165193] hover:border-[#165193]/60");

            let iconHtml = "";
            if (opt.recommended) {

                const starColor = isSelected ? "text-yellow-300" : "text-yellow-500";
                // 'ml-auto' pushes the star all the way to the right edge.
                iconHtml = `
                <svg class="w-5 h-5 shrink-0 ml-auto ${starColor}" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            `;

            }

            // Put the label first, then the star on the right.
            btn.innerHTML = `<span>${opt.label}</span>${iconHtml}`;

            btn.addEventListener("click", () => {

                answers[step.key] = opt.value;

                const changedIndex = wizard.steps.indexOf(step);
                wizard.steps.slice(changedIndex + 1).forEach((laterStep) => {
                    delete answers[laterStep.key];
                });

                render();

            });

            bodyEl.appendChild(btn);

        });

    }

    function renderSummary() {

        bodyEl.innerHTML = "";
        wizard.steps.forEach((step) => {

            const opt = step.options.find((o) => o.value === answers[step.key]);
            const row = document.createElement("div");

            row.className = "flex items-center justify-between gap-4 px-4 py-3 rounded-lg bg-[#f4f5f7] text-sm";
            row.innerHTML = `<span class="text-black/60">${step.question.replace(/\?$/, "")}</span><span class="font-semibold text-[#165193]">${opt ? opt.label : "—"}</span>`;

            bodyEl.appendChild(row);

        });

        if (wizard.manifestUrl && !isLoadingManifest && !manifestError) {

            const fileName = resolveManifestFileName(manifestData, answers);
            if (fileName) {

                const row = document.createElement("div");
                row.className = "flex items-center justify-between gap-4 px-4 py-3 rounded-lg bg-[#f4f5f7] text-sm";
                row.innerHTML = `<span class="text-black/60">File</span><span class="font-semibold text-[#165193] break-all text-right" title="${fileName}">${truncateMiddleless(fileName)}</span>`;

                bodyEl.appendChild(row);

            } else {

                const row = document.createElement("div");
                row.className = "flex items-center justify-center px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm";
                row.innerHTML = `<span class="font-medium text-red-600">Requested file was not found in the manifest, try again later.</span>`;

                bodyEl.appendChild(row);

            }

        }

    }

    async function fetchManifest() {

        if (!wizard.manifestUrl) {
            return;
        }

        isLoadingManifest = true;
        manifestError = null;

        render();

        try {

            const res = await fetch(wizard.manifestUrl, { cache: "no-store" });
            if (!res.ok) {
                throw new Error("Bad response: " + res.status);
            }

            manifestData = await res.json();

            // Safety check, ensure it's an array.
            if (!Array.isArray(manifestData)) {
                throw new Error("Manifest is not a valid array.");
            }

        } catch (err) {

            manifestData = null;
            manifestError = "Couldn't check the latest version.";

        } finally {

            isLoadingManifest = false;
            render();

        }

    }

    function renderStatus() {

        if (!wizard.manifestUrl) {

            statusEl.classList.add("hidden");

            return;

        }

        if (isLoadingManifest) {

            statusEl.textContent = "Checking for the latest version…";
            statusEl.className = "text-xs text-center mb-3 text-black/50";

        } else if (manifestError) {

            statusEl.className = "text-xs text-center mb-3 text-red-600";
            statusEl.innerHTML = `${manifestError} <button type="button" id="wizard-retry" class="underline hover:text-red-800">Retry</button>`;

            const retryBtn = document.getElementById("wizard-retry");
            if (retryBtn) {
                retryBtn.addEventListener("click", fetchManifest);
            }

        } else {
            statusEl.classList.add("hidden");
        }

    }

    function resolveManifestFileName(manifestArray, currentAnswers) {

        if (!Array.isArray(manifestArray) || !wizard.filePattern) {
            return null;
        }

        // If the manifest is an array of objects, extract the names.
        let fileNames = manifestArray;
        if (manifestArray.length > 0 && typeof manifestArray[0] === 'object' && manifestArray[0].hasOwnProperty('name')) {
            fileNames = manifestArray.map(item => item.name);
        }

        // Start with the pattern from the config.
        let regexString = wizard.filePattern;

        // Replace each {key} with the user's actual selected answer.
        for (const step of wizard.steps) {

            const answer = currentAnswers[step.key];
            if (!answer) {
                return null; // Stop if any answer is missing.
            }

            // Escape any accidental regex characters in the user's answer just to be safe.
            const escapedAnswer = answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            regexString = regexString.replace(`{${step.key}}`, escapedAnswer);

        }

        // Compile it and search the array.
        const regex = new RegExp(regexString, "i"); // "i" makes it case-insensitive.

        return fileNames.find(fileName => regex.test(fileName));

    }

    function buildDownloadUrl() {

        if (wizard.manifestUrl) {
            const fileName = resolveManifestFileName(manifestData, answers);
            return fileName ? wizard.baseUrl + fileName : null;
        }

        return wizard.downloadUrl.replace(/\{(\w+)}/g, (match, key) => answers[key] ?? match);

    }

    function triggerDownload() {

        const url = buildDownloadUrl();
        if (!url) {
            return;
        }

        const link = document.createElement("a");
        link.href = url;
        link.download = "";

        document.body.appendChild(link);

        link.click();
        link.remove();

    }

    function render() {

        renderProgress();
        renderStatus();
        backBtn.disabled = stepIndex === 0;

        if (isSummaryStep()) {

            titleEl.textContent = wizard.title;
            questionEl.textContent = "Everything look right? Here's your summary:";

            renderSummary();

            // Now checks if the regex found a match in the array.
            const fileReady = !wizard.manifestUrl || (!isLoadingManifest && !manifestError && !!resolveManifestFileName(manifestData, answers));

            nextBtn.disabled = !fileReady;
            nextBtn.classList.remove(...NEXT_COLOR_CLASSES);
            nextBtn.classList.add(...DOWNLOAD_COLOR_CLASSES);
            nextLabelEl.textContent = "Download";
            nextIconArrow.classList.add("hidden");
            nextIconDownload.classList.remove("hidden");

        } else {

            const step = currentStep();
            titleEl.textContent = wizard.title;
            questionEl.textContent = step.question;

            renderOptionButtons(step);

            nextBtn.disabled = !answers[step.key];
            nextBtn.classList.remove(...DOWNLOAD_COLOR_CLASSES);
            nextBtn.classList.add(...NEXT_COLOR_CLASSES);
            nextLabelEl.textContent = "Next";
            nextIconArrow.classList.remove("hidden");
            nextIconDownload.classList.add("hidden");

        }

    }

    function open(key) {

        wizard = WIZARDS[key];
        if (!wizard) {
            return;
        }

        stepIndex = 0;
        answers = {};
        manifestData = null;
        manifestError = null;
        isLoadingManifest = false;

        render();

        document.body.classList.add("overflow-hidden");
        overlay.classList.remove("invisible");
        requestAnimationFrame(() => {

            overlay.classList.remove("opacity-0");
            overlay.classList.add("opacity-100");
            dialog.classList.remove("scale-95");
            dialog.classList.add("scale-100");

        });

        fetchManifest();

    }

    function close() {

        overlay.classList.remove("opacity-100");
        overlay.classList.add("opacity-0");
        dialog.classList.remove("scale-100");
        dialog.classList.add("scale-95");
        document.body.classList.remove("overflow-hidden");

        setTimeout(() => {
            overlay.classList.add("invisible");
        }, TRANSITION_MS);

    }

    function goBack() {

        if (stepIndex > 0) {
            stepIndex--;
            render();
        }

    }

    function goNext() {

        if (isSummaryStep()) {

            triggerDownload();
            close();

            return;

        }
        if (!answers[currentStep().key]) {
            return;
        }

        stepIndex++;
        render();

    }

    function init() {

        overlay = document.getElementById("wizard-overlay");
        if (!overlay) {
            return;
        }

        backdrop = document.getElementById("wizard-backdrop");
        dialog = document.getElementById("wizard-dialog");
        closeBtn = document.getElementById("wizard-close");
        backBtn = document.getElementById("wizard-back");
        nextBtn = document.getElementById("wizard-next");
        nextLabelEl = document.getElementById("wizard-next-label");
        nextIconArrow = document.getElementById("wizard-next-icon-arrow");
        nextIconDownload = document.getElementById("wizard-next-icon-download");
        progressEl = document.getElementById("wizard-progress");
        titleEl = document.getElementById("wizard-title");
        questionEl = document.getElementById("wizard-question");
        bodyEl = document.getElementById("wizard-body");
        statusEl = document.getElementById("wizard-status");

        document.querySelectorAll("[data-wizard]").forEach((trigger) => {
            trigger.addEventListener("click", () => open(trigger.getAttribute("data-wizard")));
        });

        backdrop.addEventListener("click", close);
        closeBtn.addEventListener("click", close);
        backBtn.addEventListener("click", goBack);
        nextBtn.addEventListener("click", goNext);

        document.addEventListener("keydown", (e) => {

            if (e.key === "Escape" && !overlay.classList.contains("invisible")) {
                close();
            }

        });

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
