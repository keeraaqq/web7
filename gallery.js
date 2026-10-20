"use strict";

const phoneQuery = window.matchMedia("(max-width: 600px)");


function getPerView() {
    return (phoneQuery.matches) ? 1 : 3;
}

function init() {
    const track = document.getElementById("track");
    const viewport = document.getElementById("viewport");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const dotsBox = document.getElementById("dots");
    const pagerText = document.getElementById("pager-text");
    const total = track.children.length;

    let perView = getPerView();
    let currentPageIndex = 0;
    let dots = [];

    function pageCount() {
        return Math.ceil(total / perView);
    }

    function render() {
        const startIndex = Math.min(currentPageIndex * perView, total - perView);

        track.style.transform = "translateX(" + (-startIndex * 100 / perView) + "%)";

        dots.forEach(function (dot, number) {
            dot.classList.toggle("active", number === currentPageIndex);
            if (number === currentPageIndex) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });

        pagerText.textContent = "Страница " + (currentPageIndex + 1) + " из " + pageCount();
    }

    function goToPage(pageNumber) {
        const count = pageCount();
        currentPageIndex = (pageNumber + count) % count; 
        render();
    }

    function buildDots() {
        dotsBox.textContent = "";
        dots = Array.from({length: pageCount()}, function (ignore, number) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "dot";
            dot.setAttribute("aria-label", "Страница " + (number + 1));
            dot.addEventListener("click", function () {
                goToPage(number);
            });
            dotsBox.appendChild(dot);
            return dot;
        });
    }

    prevButton.addEventListener("click", function () {
        goToPage(currentPageIndex - 1);
    });
    
    nextButton.addEventListener("click", function () {
        goToPage(currentPageIndex + 1);
    });

    document.getElementById("gallery").addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") {
            goToPage(currentPageIndex - 1);
        } else if (event.key === "ArrowRight") {
            goToPage(currentPageIndex + 1);
        }
    });

    let startX = null;
    viewport.addEventListener("pointerdown", function (event) {
        startX = event.clientX;
    });
    viewport.addEventListener("pointerup", function (event) {
        if (startX !== null && Math.abs(event.clientX - startX) > 40) {
            if (event.clientX < startX) {
                goToPage(currentPageIndex + 1);
            } else {
                goToPage(currentPageIndex - 1);
            }
        }
        startX = null;
    });
    viewport.addEventListener("pointercancel", function () {
        startX = null;
    });

    phoneQuery.addEventListener("change", function () {
        perView = getPerView();
        if (currentPageIndex >= pageCount()) {
            currentPageIndex = pageCount() - 1;
        }
        buildDots();
        render();
    });

    buildDots();
    render();
}

document.addEventListener("DOMContentLoaded", init);
