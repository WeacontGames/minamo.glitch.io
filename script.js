document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const colorOptions = document.querySelectorAll(".color-option");
    let selectedColor = "#FF0000"; // Varsayılan renk
    let squares = []; // Kare verilerini tutacak dizi
    let zoomFactor = 1.1; // Yakınlaştırma faktörü
    let mouseX = window.innerWidth / 2; // Fare pozisyonunu tutacak değişkenler, başlangıçta ekranın ortasına koyuyoruz
    let mouseY = window.innerHeight / 2;

    // Canvas boyutunu viewport boyutuna eşitle
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // localStorage'den kare verilerini al
    const savedSquares = localStorage.getItem("savedSquares");
    if (savedSquares) {
        squares = JSON.parse(savedSquares);
        redrawCanvas(); // Sayfa yüklendiğinde var olan kareleri tekrar çiz
    }

    // Renk seçenekleri için olay dinleyicilerini ayarla
    colorOptions.forEach(option => {
        option.addEventListener("click", function() {
            selectedColor = option.style.backgroundColor;
        });
    });

    // Fare hareketlerini izle
    canvas.addEventListener("mousemove", function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        redrawCanvas(); // Fare hareket ettikçe canvas'ı yeniden çiz
    });

    // Fare tekerleği olaylarını dinle
    canvas.addEventListener("wheel", function(event) {
        event.preventDefault(); // Varsayılan tekerlek davranışını önle

        const zoomIn = event.deltaY < 0; // Yukarı tekerlek: true, Aşağı tekerlek: false

        zoomCanvas(zoomIn); // Yakınlaştır veya uzaklaştır
    });

    // Canvas üzerindeki tıklama olayı için dinleyici ekle
    canvas.addEventListener("click", function(event) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width; // Mouse pozisyonunu canvas koordinatlarına dönüştürmek için ölçek
        const scaleY = canvas.height / rect.height;
        
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        // Kareyi diziye ekle
        squares.push({ x: x, y: y, color: selectedColor });

        // Kare verilerini localStorage'a kaydet
        localStorage.setItem("savedSquares", JSON.stringify(squares));

        // Yeni kareyi çiz
        drawSquare(x, y, selectedColor);
    });

    // Canvas üzerindeki tüm kareleri tekrar çizecek fonksiyon
    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas'ı temizle

        squares.forEach(square => {
            drawSquare(square.x, square.y, square.color);
        });
    }

    // Yakınlaştırma fonksiyonu
    function zoomCanvas(zoomIn) {
        const prevWidth = canvas.width;
        const prevHeight = canvas.height;

        if (zoomIn) {
            canvas.width *= zoomFactor;
            canvas.height *= zoomFactor;
        } else {
            canvas.width /= zoomFactor;
            canvas.height /= zoomFactor;
        }

        // Mouse pozisyonuna göre canvas'ın konumunu ayarla
        const offsetX = mouseX - (mouseX / prevWidth) * prevWidth;
        const offsetY = mouseY - (mouseY / prevHeight) * prevHeight;

        canvas.style.left = `${parseInt(canvas.style.left) - offsetX * (zoomIn ? zoomFactor - 1 : 1 / zoomFactor)}px`;
        canvas.style.top = `${parseInt(canvas.style.top) - offsetY * (zoomIn ? zoomFactor - 1 : 1 / zoomFactor)}px`;

        redrawCanvas(); // Canvas'ı yeniden çiz
    }

    // Kare çizimi fonksiyonu
    function drawSquare(x, y, color) {
        const size = 20; // Kare boyutu
        ctx.fillStyle = color;
        ctx.fillRect(x - size / 2, y - size / 2, size, size); // Orta noktadan başlayarak kare çiz
    }

    // Pencere boyutu değiştiğinde canvas'ı yeniden boyutlandır
    window.addEventListener("resize", function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        redrawCanvas(); // Yeniden boyutlandırmadan sonra kareleri tekrar çiz
    });
});
