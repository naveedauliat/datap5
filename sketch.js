// Coffee consumption and production data (simulated CSV data)
const coffeeData = [
    { country: "Brazil", production: 3558, consumption: 1281, color: "#e8b44c" },
    { country: "Vietnam", production: 1542, consumption: 328, color: "#d4a569" },
    { country: "Colombia", production: 858, consumption: 122, color: "#c98d4f" },
    { country: "Indonesia", production: 774, consumption: 276, color: "#b87941" },
    { country: "Ethiopia", production: 469, consumption: 387, color: "#a86832" },
    { country: "Honduras", production: 475, consumption: 48, color: "#8b5a2b" },
    { country: "India", production: 348, consumption: 128, color: "#cd853f" },
    { country: "Uganda", production: 285, consumption: 48, color: "#daa520" }
];

let angle = 0;
let particles = [];
let selectedBar = -1;

function setup() {
    let canvas = createCanvas(1000, 700);
    canvas.parent('canvas-container');
    
    // Create ambient particles
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            size: random(2, 5),
            speed: random(0.2, 0.8),
            alpha: random(100, 200)
        });
    }
}

function draw() {
    // Gradient background
    drawGradient();
    
    // Draw ambient particles
    drawParticles();
    
    // Title
    drawTitle();
    
    // Draw visualization
    drawBars();
    
    // Draw legend
    drawLegend();
    
    angle += 0.01;
}

function drawGradient() {
    let c1 = color(26, 26, 46);
    let c2 = color(22, 33, 62);
    
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(0, y, width, y);
    }
}

function drawParticles() {
    noStroke();
    for (let p of particles) {
        fill(232, 180, 76, p.alpha);
        circle(p.x, p.y, p.size);
        
        p.y -= p.speed;
        p.x += sin(p.y * 0.01) * 0.5;
        
        if (p.y < 0) {
            p.y = height;
            p.x = random(width);
        }
    }
}

function drawTitle() {
    textAlign(CENTER);
    
    // Main title with glow effect
    fill(232, 180, 76, 30);
    textSize(48);
    textStyle(BOLD);
    for (let i = 0; i < 3; i++) {
        text("☕ Global Coffee Production & Consumption", width/2, 70 + i);
    }
    
    fill(255);
    text("☕ Global Coffee Production & Consumption", width/2, 70);
    
    // Subtitle
    textSize(16);
    textStyle(NORMAL);
    fill(200, 200, 220);
    text("Thousand 60kg bags per year", width/2, 100);
}

function drawBars() {
    let barWidth = 80;
    let spacing = 110;
    let startX = 80;
    let baseY = height - 100;
    let maxVal = max(coffeeData.map(d => d.production));
    
    // Check hover
    let hoveredBar = -1;
    for (let i = 0; i < coffeeData.length; i++) {
        let x = startX + i * spacing;
        if (mouseX > x - barWidth/2 && mouseX < x + barWidth/2 && 
            mouseY > 150 && mouseY < baseY) {
            hoveredBar = i;
        }
    }
    
    for (let i = 0; i < coffeeData.length; i++) {
        let d = coffeeData[i];
        let x = startX + i * spacing;
        
        let prodHeight = map(d.production, 0, maxVal, 0, 350);
        let consHeight = map(d.consumption, 0, maxVal, 0, 350);
        
        let isHovered = hoveredBar === i;
        let barW = isHovered ? barWidth * 1.1 : barWidth;
        
        // Production bar (larger, behind)
        drawBar(x - barW/4, baseY, barW/2.2, prodHeight, d.color, 180, isHovered);
        
        // Consumption bar (smaller, in front)
        let consColor = color(100, 150, 255);
        drawBar(x + barW/4, baseY, barW/2.2, consHeight, consColor, 180, isHovered);
        
        // Country label
        fill(255);
        textAlign(CENTER);
        textSize(12);
        textStyle(NORMAL);
        push();
        translate(x, baseY + 20);
        rotate(-PI/6);
        text(d.country, 0, 0);
        pop();
        
        // Values on hover
        if (isHovered) {
            fill(255, 255, 255, 240);
            noStroke();
            rectMode(CENTER);
            rect(x, baseY - prodHeight - 60, 160, 50, 10);
            
            fill(50);
            textSize(11);
            textStyle(BOLD);
            text("Production: " + d.production.toLocaleString(), x, baseY - prodHeight - 65);
            text("Consumption: " + d.consumption.toLocaleString(), x, baseY - prodHeight - 50);
        }
    }
}

function drawBar(x, baseY, w, h, col, alpha, isHovered) {
    let animH = h * (1 + sin(angle + x * 0.01) * 0.02);
    
    // Shadow
    fill(0, 0, 0, 50);
    noStroke();
    rect(x + 3, baseY - 2, w, 2, 5);
    
    // Bar gradient
    for (let i = 0; i < animH; i++) {
        let inter = map(i, 0, animH, 0, 1);
        let c = lerpColor(color(col), color(0, 0, 0), inter * 0.3);
        stroke(red(c), green(c), blue(c), alpha);
        line(x - w/2, baseY - i, x + w/2, baseY - i);
    }
    
    // Highlight on top
    if (isHovered) {
        stroke(255, 255, 255, 100);
        strokeWeight(2);
        noFill();
        rect(x, baseY - animH/2, w - 2, animH - 2, 5);
    }
    
    // Glow effect
    if (isHovered) {
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = col;
    }
    
    noStroke();
    fill(red(col), green(col), blue(col), 30);
    rect(x, baseY - animH/2, w + 10, animH + 10, 8);
    
    drawingContext.shadowBlur = 0;
    
    strokeWeight(1);
    rectMode(CENTER);
}

function drawLegend() {
    let legendX = width - 180;
    let legendY = 150;
    
    // Legend box
    fill(30, 30, 50, 200);
    stroke(100, 100, 120);
    strokeWeight(1);
    rect(legendX, legendY, 150, 80, 10);
    
    // Production legend
    fill(232, 180, 76);
    noStroke();
    rect(legendX - 50, legendY - 15, 20, 20, 3);
    fill(255);
    textAlign(LEFT);
    textSize(13);
    text("Production", legendX - 20, legendY - 10);
    
    // Consumption legend
    fill(100, 150, 255);
    rect(legendX - 50, legendY + 15, 20, 20, 3);
    fill(255);
    text("Consumption", legendX - 20, legendY + 20);
}