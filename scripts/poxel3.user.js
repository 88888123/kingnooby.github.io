// ==UserScript==
// @name         Poxel.io LKT aim Menu
// @namespace    https://kingnooby.dev/
// @version      3.0
// @description  Elegant technical control panel (press L)
// @match        *://poxel.io/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    /************************************
     * 1. Inject Technical UI Styles
     ************************************/
    const style = document.createElement("style");
    style.innerHTML = `
        /* Glass panel */
        #lktPanel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            width: 420px;
            padding: 22px;
            background: rgba(10, 10, 15, 0.55);
            border: 1px solid rgba(0, 255, 255, 0.4);
            border-radius: 14px;
            backdrop-filter: blur(14px);
            box-shadow: 0 0 25px rgba(0, 255, 255, 0.35);
            color: #dff;
            font-family: 'Segoe UI', sans-serif;
            display: none;
            z-index: 999999;
            transition: 0.18s ease;
        }

        #lktPanel h1 {
            margin: 0 0 12px 0;
            font-size: 22px;
            text-align: center;
            color: #00eaff;
            letter-spacing: 1px;
        }

        .lktSection {
            margin-top: 18px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(0,255,255,0.15);
        }

        .lktSection h2 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #00eaff;
        }

        /* Toggle switch */
        .lktToggle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 8px 0;
            font-size: 14px;
        }

        .lktSwitch {
            width: 42px;
            height: 22px;
            background: rgba(0,0,0,0.4);
            border: 1px solid #00eaff;
            border-radius: 20px;
            position: relative;
            cursor: pointer;
            transition: 0.15s ease;
        }

        .lktSwitch::after {
            content: "";
            position: absolute;
            top: 2px;
            left: 2px;
            width: 18px;
            height: 18px;
            background: #00eaff;
            border-radius: 50%;
            transition: 0.15s ease;
        }

        .lktSwitch.active {
            background: rgba(0,255,255,0.25);
        }

        .lktSwitch.active::after {
            transform: translateX(20px);
        }
    `;
    document.head.appendChild(style);

    /************************************
     * 2. Create Panel Structure
     ************************************/
    const panel = document.createElement("div");
    panel.id = "lktPanel";
    panel.innerHTML = `
        <h1>LKT Control Panel</h1>

        <div class="lktSection">
            <h2>General</h2>
            <div class="lktToggle">
                <span>Respawn Hotkey (R)</span>
                <div class="lktSwitch" id="toggleRespawn"></div>
            </div>
            <div class="lktToggle">
                <span>Clean UI Mode</span>
                <div class="lktSwitch" id="toggleCleanUI"></div>
            </div>
        </div>

        <div class="lktSection">
            <h2>Visual</h2>
            <div class="lktToggle">
                <span>Zoom Control (CTRL + Scroll)</span>
                <div class="lktSwitch" id="toggleZoom"></div>
            </div>
        </div>

        <div class="lktSection">
            <h2>Debug</h2>
            <div class="lktToggle">
                <span>Show FPS Overlay</span>
                <div class="lktSwitch" id="toggleFPS"></div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    /************************************
     * 3. Panel Toggle (Press L)
     ************************************/
    let open = false;
    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "l") {
            open = !open;
            panel.style.display = open ? "block" : "none";
        }
    });

    /************************************
     * 4. Utility Toggles
     ************************************/
    function bindToggle(id, callback) {
        const el = document.getElementById(id);
        let active = false;

        el.onclick = () => {
            active = !active;
            el.classList.toggle("active");
            callback(active);
        };
    }

    /************************************
     * Respawn Hotkey
     ************************************/
    let respawnEnabled = false;

    bindToggle("toggleRespawn", (state) => {
        respawnEnabled = state;
    });

    window.addEventListener("keydown", (e) => {
        if (respawnEnabled && e.key.toLowerCase() === "r") {
            const r = document.querySelector("#respawnButton, .respawn-btn");
            if (r) r.click();
        }
    });

    /************************************
     * Clean UI Mode
     ************************************/
    let cleanUI = false;

    bindToggle("toggleCleanUI", (state) => {
        cleanUI = state;
        const hide = cleanUI ? "none" : "block";

        [
            "#leaderboard",
            ".ad-container",
            ".footer",
            ".social-buttons"
        ].forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.style.display = hide;
        });
    });

    /************************************
     * Zoom Control
     ************************************/
    let zoomEnabled = false;
    let zoom = 1;

    bindToggle("toggleZoom", (state) => {
        zoomEnabled = state;
    });

    window.addEventListener("wheel", (e) => {
        if (!zoomEnabled) return;
        if (e.ctrlKey) {
            e.preventDefault();
            zoom += e.deltaY * -0.001;
            zoom = Math.min(1.8, Math.max(0.5, zoom));
            document.body.style.zoom = zoom;
        }
    }, { passive: false });

    /************************************
     * FPS Overlay
     ************************************/
    let fpsEnabled = false;
    let fpsBox = null;

    bindToggle("toggleFPS", (state) => {
        fpsEnabled = state;

        if (state) {
            fpsBox = document.createElement("div");
            fpsBox.style.position = "fixed";
            fpsBox.style.top = "20px";
            fpsBox.style.left = "20px";
            fpsBox.style.padding = "6px 10px";
            fpsBox.style.background = "rgba(0,0,0,0.45)";
            fpsBox.style.border = "1px solid #00eaff";
            fpsBox.style.color = "#00eaff";
            fpsBox.style.fontSize = "14px";
            fpsBox.style.borderRadius = "6px";
            fpsBox.style.backdropFilter = "blur(6px)";
            fpsBox.style.zIndex = "999999";
            document.body.appendChild(fpsBox);

            let last = performance.now();
            function loop() {
                if (!fpsEnabled) return;
                const now = performance.now();
                const fps = Math.round(1000 / (now - last));
                last = now;
                fpsBox.textContent = `FPS: ${fps}`;
                requestAnimationFrame(loop);
            }
            loop();
        } else {
            if (fpsBox) fpsBox.remove();
        }
    });
})();
