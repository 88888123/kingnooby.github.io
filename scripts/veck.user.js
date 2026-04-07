// ==UserScript==
// @name         Veck.io LKT aim Menu
// @namespace    https://kingnooby.dev/
// @version      1.0
// @description  Marine-blue menu to choose dot/circle + color cycling with Z (perfect centering for Veck.io)
// @match        *://veck.io/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    /********************************
     * 1. Styles
     ********************************/
    const style = document.createElement("style");
    style.innerHTML = `
        #lktDot, #lktCircle {
            position: fixed;
            top: 50%;
            left: 50%;
            pointer-events: none;
            z-index: 999999;
        }

        #lktDot {
            border-radius: 50%;
            display: none;
        }

        #lktCircle {
            border-radius: 50%;
            border-style: solid;
            display: none;
        }

        /* Marine-blue menu */
        #lktMenu {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 320px;
            transform: translate(-50%, -50%);
            padding: 20px;
            background: rgba(10, 25, 40, 0.65);
            border: 1px solid rgba(80, 150, 255, 0.4);
            border-radius: 14px;
            backdrop-filter: blur(12px);
            color: #d0e6ff;
            font-family: "Segoe UI", sans-serif;
            font-size: 14px;
            z-index: 999999;
            display: none;
        }

        #lktMenu h2 {
            margin: 0 0 14px 0;
            text-align: center;
            color: #4aa3ff;
            font-size: 20px;
        }

        .lktOption {
            margin: 10px 0;
            padding: 10px;
            background: rgba(20, 40, 70, 0.5);
            border: 1px solid rgba(80, 150, 255, 0.3);
            border-radius: 8px;
            cursor: pointer;
            transition: 0.15s ease;
        }

        .lktOption:hover {
            background: rgba(40, 70, 110, 0.6);
        }

        #lktMenu label {
            display: flex;
            justify-content: space-between;
            margin: 6px 0;
        }

        #lktMenu input[type="range"] {
            width: 140px;
        }
    `;
    document.head.appendChild(style);

    /********************************
     * 2. Reticle Elements
     ********************************/
    const dot = document.createElement("div");
    dot.id = "lktDot";

    const circle = document.createElement("div");
    circle.id = "lktCircle";

    document.body.appendChild(dot);
    document.body.appendChild(circle);

    let mode = "dot";

    /********************************
     * 3. Menu UI
     ********************************/
    const menu = document.createElement("div");
    menu.id = "lktMenu";
    menu.innerHTML = `
        <h2>Reticle Menu</h2>

        <div class="lktOption" id="chooseDot">Aim Dot</div>
        <div class="lktOption" id="chooseCircle">Aim Circle</div>

        <label>
            <span>Size</span>
            <input id="retSize" type="range" min="4" max="120" value="30">
        </label>

        <label>
            <span>Opacity</span>
            <input id="retOpacity" type="range" min="20" max="100" value="100">
        </label>

        <small>Press G to toggle menu • Press Z to change color</small>
    `;
    document.body.appendChild(menu);

    /********************************
     * 4. Menu Toggle (G)
     ********************************/
    let open = false;
    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "g") {
            open = !open;
            menu.style.display = open ? "block" : "none";
        }
    });

    /********************************
     * 5. Color Cycling (Z)
     ********************************/
    const colors = [
        "#4aa3ff", "#00eaff", "#00ff9d", "#ffdd00",
        "#ff9a00", "#ff4d4d", "#ff00c8", "#b300ff",
        "#7d5fff", "#00ffaa", "#66ff66", "#ffffff"
    ];

    let colorIndex = 0;

    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "z") {
            colorIndex = (colorIndex + 1) % colors.length;
            updateReticle();
        }
    });

    /********************************
     * 6. Reticle Logic (Perfect Centering)
     ********************************/
    function updateReticle() {
        const size = parseInt(sizeInput.value, 10);
        const opacity = parseInt(opacityInput.value, 10) / 100;
        const color = colors[colorIndex];

        if (mode === "dot") {
            dot.style.display = "block";
            circle.style.display = "none";

            dot.style.width = size + "px";
            dot.style.height = size + "px";
            dot.style.marginLeft = -(size / 2) + "px";
            dot.style.marginTop = -(size / 2) + "px";
            dot.style.background = color;
            dot.style.boxShadow = `0 0 ${size}px ${color}`;
            dot.style.opacity = opacity;
        }

        if (mode === "circle") {
            dot.style.display = "none";
            circle.style.display = "block";

            const diameter = size * 2;
            const thickness = Math.max(2, size / 15);

            circle.style.width = diameter + "px";
            circle.style.height = diameter + "px";
            circle.style.marginLeft = -(diameter / 2) + "px";
            circle.style.marginTop = -(diameter / 2) + "px";
            circle.style.borderWidth = thickness + "px";
            circle.style.borderColor = color;
            circle.style.boxShadow = `0 0 ${size}px ${color}`;
            circle.style.opacity = opacity;
        }
    }

    /********************************
     * 7. Bind Menu Controls
     ********************************/
    const sizeInput = menu.querySelector("#retSize");
    const opacityInput = menu.querySelector("#retOpacity");

    sizeInput.oninput = updateReticle;
    opacityInput.oninput = updateReticle;

    document.getElementById("chooseDot").onclick = () => {
        mode = "dot";
        updateReticle();
    };

    document.getElementById("chooseCircle").onclick = () => {
        mode = "circle";
        updateReticle();
    };

    updateReticle();
})();
