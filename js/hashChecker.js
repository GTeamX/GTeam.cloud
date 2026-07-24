(function () {
    "use strict";

    const dropzone = document.getElementById("hash-dropzone");
    const fileInput = document.getElementById("hash-file-input");
    const resultsContainer = document.getElementById("hash-results");

    const manifestUrl = "http://localhost:63342/GTeam.cloud/cloud/manifest.json"; // TODO: change
    const validHashes = new Map();
    let manifestLoaded = false;

    async function loadManifest() {
        try {
            const res = await fetch(manifestUrl, { cache: "no-store" });
            if (!res.ok) throw new Error("Bad response: " + res.status);

            const data = await res.json();
            if (!Array.isArray(data)) {
                console.warn("Hash Checker: Manifest is not an array.");
                return;
            }

            data.forEach(item => {
                if (typeof item === 'object' && item.hash) {
                    const hash = item.hash.toLowerCase().trim();
                    const fileName = item.name || "Unknown File";
                    validHashes.set(hash, fileName);
                }
            });

            manifestLoaded = true;
            console.log(`Hash Checker: Manifest loaded. ${validHashes.size} entries found.`);
        } catch (err) {
            console.warn("Hash Checker: Could not load manifest.", err);
            manifestLoaded = false;
        }
    }

    document.addEventListener("DOMContentLoaded", loadManifest);

    const highlightDropzone = () => {
        if (!dropzone) return;
        dropzone.classList.add("bg-[#165193]/10", "border-solid");
        dropzone.classList.remove("bg-white", "border-dashed");
    };

    const resetDropzone = () => {
        if (!dropzone) return;
        dropzone.classList.remove("bg-[#165193]/10", "border-solid");
        dropzone.classList.add("bg-white", "border-dashed");
    };

    if (dropzone) {
        dropzone.addEventListener("dragover", (e) => { e.preventDefault(); highlightDropzone(); });
        dropzone.addEventListener("dragleave", resetDropzone);
        dropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            resetDropzone();
            if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
        });
    }

    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) handleFiles(e.target.files);
            fileInput.value = "";
        });
    }

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (!document.getElementById(`hash-card-${file.name}-${Date.now()}`)) {
                processFile(file);
            }
        });
    }

    function formatSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async function processFile(file) {
        const uniqueId = `${file.name}-${Date.now()}`;
        const ui = createResultCard(file, uniqueId);

        try {

            if (typeof hashwasm === 'undefined' || !hashwasm.createSHA256) {
                throw new Error("HashWASM library not loaded.");
            }

            const hasher = await hashwasm.createSHA256();
            hasher.init();

            const chunkSize = 8 * 1024 * 1024;
            let offset = 0;

            while (offset < file.size) {
                const slice = file.slice(offset, offset + chunkSize);
                const arrayBuffer = await slice.arrayBuffer();
                const buffer = new Uint8Array(arrayBuffer);
                hasher.update(buffer);
                offset += buffer.length;

                const percent = Math.min(100, (offset / file.size) * 100).toFixed(1);
                ui.progressBar.style.width = `${percent}%`;
                ui.statusText.textContent = `Calculating... ${percent}%`;

                await new Promise(resolve => requestAnimationFrame(resolve));
            }

            const finalHash = hasher.digest().toLowerCase();
            finalizeCard(ui, finalHash);

        } catch (error) {
            console.error(error);
            ui.statusText.textContent = "Error processing file.";
            ui.statusText.classList.replace("text-[#165193]", "text-red-600");
            ui.progressBarWrapper.classList.add("hidden");
            ui.el.classList.replace("border-gray-200", "border-red-500");
            ui.el.classList.replace("bg-white", "bg-red-50");
            ui.copyBtn.classList.add("hidden");
        }
    }

    function createResultCard(file, id) {
        const card = document.createElement("div");
        card.id = `hash-card-${id}`;
        card.className = "relative bg-white border-2 border-gray-200 rounded-xl p-5 flex flex-col gap-1 shadow-sm transition-colors text-left animate-fade-in overflow-hidden";

        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex flex-col pr-8">
                    <span class="font-bold font-grotesk text-lg text-black truncate w-full">${file.name}</span>
                    <span class="text-sm text-black/60">${formatSize(file.size)}</span>
                </div>
                <button type="button" class="text-black/30 hover:text-black/60 transition-colors p-1" title="Remove">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <div class="py-1">
                <div class="w-full bg-gray-100 mt-9.5 rounded-full overflow-hidden border border-black/5">
                    <div class="bg-[#165193] h-2.5 rounded-full transition-all duration-75 w-0 progress-bar-fill"></div>
                </div>
            </div>

            <div class="flex flex-col gap-2 result-tab">
                <span class="text-sm font-medium text-[#165193] block status-text">Preparing...</span>
                <div class="hidden items-center justify-between gap-3 copy-hash-container">
                    <div class="font-mono text-xs text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-200 tracking-wide break-all select-all flex-1 copy-hash-display">
                        <span class="hash-value"></span>
                    </div>
                    <button type="button" class="hidden items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-xs transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap copy-btn self-stretch w-24 shrink-0">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span>Copy</span>
                    </button>
                </div>
            </div>
        `;

        card.querySelector("button[type='button']").addEventListener("click", () => {

            card.remove()

            if (resultsContainer.childElementCount === 0 && resultsContainer.classList.contains("mt-8")) {
                resultsContainer.classList.remove("mt-8");
            }

        });

        if (!resultsContainer.classList.contains("mt-8")) {
            resultsContainer.classList.add("mt-8");
        }

        resultsContainer.prepend(card);

        return {
            el: card,
            progressBarWrapper: card.querySelector(".py-1"),
            progressBar: card.querySelector(".progress-bar-fill"),
            statusText: card.querySelector(".status-text"),
            copyBtn: card.querySelector(".copy-btn"),
            hashContainer: card.querySelector(".copy-hash-container"),
            hashDisplay: card.querySelector(".copy-hash-display"),
            hashValueSpan: card.querySelector(".hash-value"),
            resultTab: card.querySelector(".result-tab")
        };
    }

    function finalizeCard(ui, hash) {
        ui.progressBarWrapper.classList.add("hidden");
        ui.hashContainer.classList.remove("hidden");
        ui.hashContainer.classList.add("flex");
        ui.hashValueSpan.textContent = hash;
        ui.resultTab.classList.add("pt-4");

        ui.copyBtn.classList.remove("hidden");
        ui.copyBtn.classList.add("inline-flex");

        const matchingFile = manifestLoaded && validHashes.has(hash) ? validHashes.get(hash) : null;
        const isSuccess = Boolean(matchingFile);

        const borderClass = isSuccess ? "border-emerald-500" : "border-rose-500";
        const bgClass = isSuccess ? "bg-emerald-50" : "bg-rose-50";
        const textClass = isSuccess ? "text-emerald-700" : "text-rose-700";
        const btnBgClass = isSuccess ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600";

        ui.el.classList.remove("border-gray-200", "bg-white");
        ui.el.classList.add(borderClass, bgClass);

        ui.statusText.textContent = isSuccess ? `Verified: Matches ${matchingFile}` : "Invalid: Hash not found in manifest";
        ui.statusText.classList.replace("text-[#165193]", textClass);
        ui.statusText.classList.add("font-semibold");

        ui.copyBtn.className = `hidden items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-xs transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap text-white ${btnBgClass} inline-flex self-stretch w-[96px] shrink-0`;

        ui.copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(hash);

            const originalContent = ui.copyBtn.innerHTML;
            ui.copyBtn.innerHTML = `
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Copied!</span>
            `;

            setTimeout(() => {
                ui.copyBtn.innerHTML = originalContent;
            }, 2000);
        });
    }

})();