// ==UserScript==
// @name         Snake.io Custom Menu
// @namespace    https://kingnooby.dev
// @version      1.0
// @description  Custom cheat-style menu overlay for Snake.io (client-side mods only)
// @match        *://*.snake.io/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    /******************************
     *  CREATE MENU CONTAINER
     ******************************/
    const menu = document.createElement("div");
    menu.id = "kn-menu";
    menu.style = `
        position: fixed;
        top: 20px;
        left: 20px;
        width: 220px;
        padding: 15px;
        background: rgba(0,0,0,0.75);
        border: 2px solid #0ff;
        border-radius: 10px;
        color: #0ff;
        font-family: Arial, sans-serif;
        z-index: 999999;
        backdrop-filter: blur(6px);
    `;
    menu.innerHTML = `
        <h2 style="margin:0 0 10px 0; font-size:18px; text-align:center;">
            KingNooby Menu
        </h2>

        <label>
            <input type="checkbox" id="zoomToggle">
            Enable Zoom
        </label><br>

        <label>
            <input type="checkbox" id="skinToggle">
            Custom Skin
        </label><br>

        <label>
            <input type="checkbox" id="fpsToggle">
            Show FPS
        </label><br>

        <hr style="border-color:#0ff;">

        <p style="font-size:12px; opacity:0.8;">
            Press <b>M</b> to toggle menu
        </p>
    `;
    document.body.appendChild(menu);

    /******************************
     *  MENU TOGGLE (M KEY)
     ******************************/
    let menuVisible = true;
    document.addEventListener("keydown", e => {
        if (e.key.toLowerCase() === "m") {
            menuVisible = !menuVisible;
            menu.style.display = menuVisible ? "block" : "none";
        }
    });

    /******************************
     *  FEATURE HOOKS
     ******************************/
    const zoomToggle = document.getElementById("zoomToggle");
    const skinToggle = document.getElementById("skinToggle");
    const fpsToggle = document.getElementById("fpsToggle");

    zoomToggle.addEventListener("change", () => {
        if (zoomToggle.checked) enableZoom();
        else disableZoom();
    });

    skinToggle.addEventListener("change", () => {
        if (skinToggle.checked) applyCustomSkin();
        else removeCustomSkin();
    });

    fpsToggle.addEventListener("change", () => {
        if (fpsToggle.checked) showFPS();
        else hideFPS();
    });

    /******************************
     *  FEATURE FUNCTIONS
     ******************************/
    function enableZoom() {
        console.log("Zoom enabled");
        // Add your zoom logic here
    }

    function disableZoom() {
        console.log("Zoom disabled");
        // Remove zoom logic
    }

    function applyCustomSkin() {
        console.log("Custom skin applied");
        // Add skin modification logic
    }

    function removeCustomSkin() {
        console.log("Custom skin removed");
        // Remove skin logic
    }

    let fpsBox;
    function showFPS() {
        fpsBox = document.createElement("div");
        fpsBox.style = `
            position: fixed;
            top: 10px;
            right: 10px;
            color: #0f0;
            font-size: 16px;
            font-family: monospace;
            z-index: 999999;
        `;
        document.body.appendChild(fpsBox);

        let last = performance.now();
        function loop() {
            const now = performance.now();
            const fps = Math.round(1000 / (now - last));
            last = now;
            fpsBox.textContent = "FPS: " + fps;
            requestAnimationFrame(loop);
        }
        loop();
    }

    function hideFPS() {
        if (fpsBox) fpsBox.remove();
    }

})();
