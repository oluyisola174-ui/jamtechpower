const menuBar = document.getElementById("menu-bar");
const nav = document.querySelector("nav");
const icon = menuBar.querySelector("i");

menuBar.addEventListener("click", function () {
    nav.classList.toggle("active");

    if (nav.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
});
// Store all appliances
let appliances = [];
let customerName = "";

// Get elements
const addBtn = document.getElementById("add-btn");
const tableBody = document.getElementById("table-body");

// Add appliance
addBtn.addEventListener("click", function () {
    customerName = document.getElementById("customerName").value.trim();
    const applianceName = document.getElementById("appliance-name").value.trim();
    const watts = Number(document.getElementById("watts").value);
    const quantity = Number(document.getElementById("quantity").value);
    const hours = Number(document.getElementById("hours").value);

    // Validation
    if (
        applianceName === "" ||
        watts <= 0 ||
        quantity <= 0 ||
        hours <= 0
    ) {
        alert("Please fill in all appliance details correctly.");
        return;
    }

    // Calculate daily energy
    const dailyWh = watts * quantity * hours;

    // Save appliance
    appliances.push({
        applianceName,
        watts,
        quantity,
        hours,
        dailyWh
    });

    // Display table
    displayAppliances();

    // Clear inputs
    document.getElementById("appliance-name").value = "";
    document.getElementById("watts").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("hours").value = "";
});


// Display appliances
function displayAppliances() {

    tableBody.innerHTML = "";

    if (appliances.length === 0) {

        tableBody.innerHTML = `
        <tr>
            <td colspan="6">No appliances added yet.</td>
        </tr>
        `;

        return;
    }

    appliances.forEach((item, index) => {

        tableBody.innerHTML += `
        <tr>

            <td>${item.applianceName}</td>

            <td>${item.watts}</td>

            <td>${item.quantity}</td>

            <td>${item.hours}</td>

            <td>${item.dailyWh}</td>

            <td>

                <button onclick="deleteAppliance(${index})">

                    Delete

                </button>

            </td>

        </tr>
        `;
    });

}


// Delete appliance
function deleteAppliance(index){

    appliances.splice(index,1);

    displayAppliances();

}
function calculateSystem() {

    if (appliances.length === 0) {
        alert("Please add at least one appliance.");
        return;
    }

    // Total Daily Energy
    let totalEnergy = 0;

    appliances.forEach(item => {
        totalEnergy += item.dailyWh;
    });

    document.getElementById("daily-energy").textContent =
        totalEnergy.toLocaleString() + " Wh";



    // Recommended Solar Panels

    const sunHours = 5; // Average Peak Sun Hours in Nigeria

    const panelSize = Math.ceil(totalEnergy / sunHours);

    document.getElementById("panel-result").textContent =
        panelSize.toLocaleString() + " W";



    // Battery Capacity

    const batteryVoltage = 24;

    const batteryAh = Math.ceil(totalEnergy / batteryVoltage);

    document.getElementById("battery-result").textContent =
        batteryAh.toLocaleString() + " Ah";



    // Inverter Rating

    let totalLoad = 0;

    appliances.forEach(item => {
        totalLoad += item.watts * item.quantity;
    });

    const inverter = Math.ceil(totalLoad * 1.25);

    document.getElementById("inverter-result").textContent =
        inverter.toLocaleString() + " VA";



    // Backup Time

    const backupHours = Math.round((batteryAh * batteryVoltage) / totalLoad);

    document.getElementById("backup-result").textContent =
        backupHours + " Hours";



    // Engineer Recommendation

    document.getElementById("recommendation-text").innerHTML = `
    <strong>Recommended System</strong><br><br>

    Solar Panels: ${panelSize} W<br>

    Battery Bank: ${batteryVoltage}V ${batteryAh}Ah<br>

    Inverter: ${inverter}VA Pure Sine Wave<br>

    Backup Time: ${backupHours} Hours
    `;

}
function resetCalculator() {

    // Clear customer name
    customerName = "";
    document.getElementById("customerName").value = "";

    // Clear appliance inputs
    document.getElementById("appliance-name").value = "";
    document.getElementById("watts").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("hours").value = "";

    // Clear appliance array
    appliances = [];

    // Reset table
    tableBody.innerHTML = `
        <tr>
            <td colspan="6">No appliances added yet.</td>
        </tr>
    `;

    // Reset summary
    document.getElementById("daily-energy").textContent = "0 Wh";
    document.getElementById("panel-result").textContent = "0 W";
    document.getElementById("battery-result").textContent = "0 Ah";
    document.getElementById("inverter-result").textContent = "0 VA";
    document.getElementById("backup-result").textContent = "0 Hours";

    // Reset recommendation
    document.getElementById("recommendation-text").textContent =
        "Your personalized recommendation will appear here after calculation.";
}
async function generatePDF() {

    if (appliances.length === 0) {
        alert("Please add appliances first.");
        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    // Company Name
    doc.setFontSize(18);
    doc.text("JAMTECH ELECTRICAL & SOLAR HOMES LTD", 15, y);

    y += 10;

    doc.setFontSize(15);
    doc.text("SOLAR LOAD ASSESSMENT REPORT", 15, y);

    y += 15;

    doc.setFontSize(12);

    doc.text("Customer Name: " + customerName, 15, y);

    y += 8;

    doc.text("Date: " + new Date().toLocaleDateString(), 15, y);

    y += 15;

    doc.setFontSize(14);

    doc.text("APPLIANCE LIST", 15, y);

    y += 10;

    doc.setFontSize(11);

    appliances.forEach(item => {

        doc.text(
            `${item.applianceName} | ${item.watts}W | Qty:${item.quantity} | ${item.hours}hrs | ${item.dailyWh}Wh`,
            15,
            y
        );

        y += 8;

    });

    y += 10;

    doc.setFontSize(13);

    doc.text("Total Daily Energy: " + document.getElementById("daily-energy").textContent,15,y);

    y += 8;

    doc.text("Solar Panels: " + document.getElementById("panel-result").textContent,15,y);

    y += 8;

    doc.text("Battery Capacity: " + document.getElementById("battery-result").textContent,15,y);

    y += 8;

    doc.text("Inverter Rating: " + document.getElementById("inverter-result").textContent,15,y);

    y += 8;

    doc.text("Backup Time: " + document.getElementById("backup-result").textContent,15,y);

    y += 15;

    doc.setFontSize(13);

    doc.text("ENGINEER RECOMMENDATION",15,y);

    y += 10;

    const recommendation = document.getElementById("recommendation-text").innerText;

    const lines = doc.splitTextToSize(recommendation,180);

    doc.text(lines,15,y);

    y += 30;

    doc.setFontSize(11);

    doc.text("Prepared by:",15,y);

    y += 8;

    doc.text("JAMTECH ELECTRICAL & SOLAR HOMES LTD",15,y);

    y += 8;

    doc.text("Phone: +234 913 249 7711",15,y);

    doc.save("Solar_Assessment_Report.pdf");

}
document.getElementById("calculate-btn").addEventListener("click", calculateSystem);
document.getElementById("reset-btn").addEventListener("click", resetCalculator);
document.getElementById("download-btn").addEventListener("click", generatePDF);
