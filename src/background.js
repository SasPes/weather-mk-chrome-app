var min = localStorage["min"];

window.setInterval(function () {
    if (typeof (gradId) == 'undefined' || gradId == null) {
        min = 15;
        localStorage["min"] = min;
    }
    initialize();
}, 1000 * 60 * min); // 15 min