/*jslint browser */

const QUANTITY_PATTERN = /^\d+$/;

const PRICES = {
    options: {
        linux: 500,
        office: 800,
        windows: 0
    },
    property: 700,
    services: {
        clean: 2500,
        diagnostics: 1500,
        install: 2000
    }
};

function getService() {
    "use strict";
    return document.querySelector("input[name=service]:checked").value;
}

function showError(message) {
    "use strict";
    const error = document.getElementById("quantity-error");
    error.textContent = message;
    error.hidden = (message === "");
}

function updateBlocks(service) {
    "use strict";
    const optionBlock = document.getElementById("option-block");
    const propertyBlock = document.getElementById("property-block");
    const select = document.getElementById("option");
    const checkbox = document.getElementById("property");

    optionBlock.hidden = (service !== "install");
    propertyBlock.hidden = (service !== "clean");

    if (service !== "install") {
        select.selectedIndex = 0;
    }
    if (service !== "clean") {
        checkbox.checked = false;
    }
}

function readQuantity() {
    "use strict";
    const text = document.getElementById("quantity").value.trim();

    if (text === "") {
        showError("Введите количество.");
        return 0;
    }
    if (!QUANTITY_PATTERN.test(text)) {
        showError("Недопустимые символы: только цифры.");
        return 0;
    }

    const quantity = parseInt(text, 10);
    if (quantity < 1) {
        showError("Количество должно быть больше нуля.");
        return 0;
    }

    showError("");
    return quantity;
}

function showResult(main, detail) {
    "use strict";
    document.getElementById("result-main").textContent = main;
    document.getElementById("result-detail").textContent = detail;
}

function updatePrice() {
    "use strict";
    const service = getService();
    updateBlocks(service);

    const quantity = readQuantity();
    if (quantity === 0) {
        showResult("Стоимость: —", "Укажите корректное количество.");
        return;
    }

    let unit = PRICES.services[service];
    if (service === "install") {
        unit += PRICES.options[document.getElementById("option").value];
    }
    if (service === "clean" && document.getElementById("property").checked) {
        unit += PRICES.property;
    }

    const sum = unit * quantity;
    const total = sum.toLocaleString("ru-RU");
    showResult(
        `Стоимость: ${total} ₽`,
        `${unit.toLocaleString("ru-RU")} ₽ × ${quantity} шт.`
    );
}

window.addEventListener("DOMContentLoaded", function () {
    "use strict";
    const form = document.getElementById("calc-form");

    document.getElementById("quantity").addEventListener(
        "input",
        updatePrice
    );
    form.querySelectorAll("input[name=service]").forEach(function (radio) {
        radio.addEventListener("change", updatePrice);
    });
    document.getElementById("option").addEventListener("change", updatePrice);
    document.getElementById("property").addEventListener(
        "change",
        updatePrice
    );
    form.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    updatePrice();
});
