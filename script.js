function setTextContrast(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? '#000' : '#FFF'; // Adjust threshold as needed
}

function generateSeed(date) {
    var hash = 0;
    for (var i = 0; i < date.length; i++) {
        var char = date.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function pseudoRandom(seed) {
    var tempSeed = seed;
    var x = Math.sin(tempSeed++) * 10000;
    return x - Math.floor(x);
}


function generateOppositeColorsForDate(date) {
    const seed = generateSeed(date);
    const baseHue = Math.floor(pseudoRandom(seed) * 360);
    const saturation = Math.floor(pseudoRandom(seed + 1) * 50) + 50; // Saturation between 50% and 100%
    const lightness = Math.floor(pseudoRandom(seed + 2) * 30) + 20; // Lightness between 20% and 50%
    
    const primaryColor = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    const secondaryColor = `hsl(${(baseHue + 180) % 360}, ${saturation}%, ${lightness}%)`;
    
    const primaryHex = HSLToHex(baseHue, saturation, lightness);
    const secondaryHex = HSLToHex((baseHue + 180) % 360, saturation, lightness);
    
    return { primaryColor, secondaryColor, primaryHex, secondaryHex };
}

function HSLToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function displayColors(primaryColor, secondaryColor, primaryHex, secondaryHex) {
    const primaryColorBox = document.getElementById('primaryColor');
    const secondaryColorBox = document.getElementById('secondaryColor');
    primaryColorBox.style.backgroundColor = primaryColor;
    secondaryColorBox.style.backgroundColor = secondaryColor;
    document.getElementById('primaryHex').textContent = primaryHex;
    document.getElementById('secondaryHex').textContent = secondaryHex;
    primaryColorBox.style.color = setTextContrast(primaryHex);
    secondaryColorBox.style.color = setTextContrast(secondaryHex);
}

function storeColorsForDate(date, colors) {
    localStorage.setItem(date, JSON.stringify(colors));
}

function getColorsForDate(date) {
    const colors = localStorage.getItem(date);
    return colors ? JSON.parse(colors) : null;
}

function changeDate(date) {
    let colors = getColorsForDate(date);
    if (!colors) {
        colors = generateOppositeColorsForDate(date); // Use the date to generate colors
        storeColorsForDate(date, colors);
    }
    displayColors(colors.primaryColor, colors.secondaryColor, colors.primaryHex, colors.secondaryHex);
}

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString();
    document.getElementById('datePicker').max = today;
    document.getElementById('datePicker').value = today;
    changeDate(today); // Initialize with stored or new colors for today
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Ensure the switch reflects the current theme
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.checked = savedTheme === 'dark';

    themeToggle.addEventListener('click', toggleTheme);
});

function copyToClipboard(hexId) {
    const hexCode = document.querySelector(hexId).textContent;
    navigator.clipboard.writeText(hexCode).then(() => {
        alert(hexCode + ' copied to clipboard!');
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});
document.addEventListener('DOMContentLoaded', () => {
    // Other initialization code

    // Initialize Flatpickr with maxDate set to today
    flatpickr("#datePicker", {
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        defaultDate: new Date(), // Sets today's date as default
        maxDate: new Date(), // Prevents selection of future dates
        onChange: function(selectedDates, dateStr, instance) {
            changeDate(dateStr); // Updates the application based on the selected date
        }
    });
});
function pseudoRandom(seed) {
    var tempSeed = seed;
    var x = Math.sin(tempSeed++) * 10000;
    return x - Math.floor(x);
}

