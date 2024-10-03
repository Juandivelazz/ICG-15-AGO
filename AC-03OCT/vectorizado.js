class Punto {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function generarPuntos(numPuntos, ancho, alto) {
    const puntos = [];
    for (let i = 0; i < numPuntos; i++) {
        puntos.push(new Punto(Math.random() * ancho, Math.random() * alto));
    }
    // Ordenar puntos en sentido horario
    puntos.sort((a, b) => Math.atan2(a.y - alto / 2, a.x - ancho / 2) - Math.atan2(b.y - alto / 2, b.x - ancho / 2));
    return puntos;
}

function calcularCentroide(puntos) {
    const n = puntos.length;
    const cx = puntos.reduce((sum, p) => sum + p.x, 0) / n;
    const cy = puntos.reduce((sum, p) => sum + p.y, 0) / n;
    return new Punto(cx, cy);
}

function trazarPoligonoSVG(puntos, centroid) {
    const svg = document.getElementById('svg');
    svg.innerHTML = '';
    const puntosSVG = puntos.map(p => `${p.x},${p.y}`).join(" ");
    
    const poligono = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    poligono.setAttribute("points", puntosSVG);
    poligono.setAttribute("fill", "none");
    poligono.setAttribute("stroke", "black");
    svg.appendChild(poligono);

    if (centroid) {
        const centroidSVG = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        centroidSVG.setAttribute("cx", centroid.x);
        centroidSVG.setAttribute("cy", centroid.y);
        centroidSVG.setAttribute("r", "5");
        centroidSVG.setAttribute("fill", "red");
        svg.appendChild(centroidSVG);

        puntos.forEach(p => {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", centroid.x);
            line.setAttribute("y1", centroid.y);
            line.setAttribute("x2", p.x);
            line.setAttribute("y2", p.y);
            line.setAttribute("stroke", "red");
            svg.appendChild(line);
        });
    }
}

function esConvexo(puntos) {
    let signo = 0;
    const n = puntos.length;

    for (let i = 0; i < n; i++) {
        const p1 = puntos[i];
        const p2 = puntos[(i + 1) % n];
        const p3 = puntos[(i + 2) % n];

        const cross = (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
        
        if (cross !== 0) {
            const nuevoSigno = cross > 0 ? 1 : -1;
            if (signo === 0) {
                signo = nuevoSigno;
            } else if (signo !== nuevoSigno) {
                return false;
            }
        }
    }
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    const numPuntos = 5;
    const ancho = 400;
    const alto = 400;

    const puntos = generarPuntos(numPuntos, ancho, alto);
    const centroid = calcularCentroide(puntos);
    trazarPoligonoSVG(puntos, centroid);

    const tipo = esConvexo(puntos) ? "Convexo" : "Cóncavo";
    document.getElementById('tipoPoligono').textContent = tipo;

    document.getElementById('toggleCentroidSVG').addEventListener('click', () => {
        const centroidInfoSVG = document.getElementById('centroidInfoSVG');
        if (centroidInfoSVG.style.display === 'none') {
            centroidInfoSVG.style.display = 'block';
            centroidInfoSVG.textContent = `Centroide: (${centroid.x.toFixed(2)}, ${centroid.y.toFixed(2)})`;
            trazarPoligonoSVG(puntos, centroid);
        } else {
            centroidInfoSVG.style.display = 'none';
            trazarPoligonoSVG(puntos, null);
        }
    });
});
