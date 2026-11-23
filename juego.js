// Demo jugable de la portada: mosaicos que giran solos y al tocarlos, reloj en vivo y un personaje de Hopsie
// que se inclina hacia el puntero y tropieza al tocarlo. Sin dependencias ni llamadas a terceros.
(function () {
  var quieto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var idioma = document.documentElement.lang || "en";

  var hora = document.querySelector("[data-reloj]"), fecha = document.querySelector("[data-fecha]");
  function reloj() {
    var d = new Date();
    if (hora) hora.textContent = d.toLocaleTimeString(idioma, { hour: "2-digit", minute: "2-digit" });
    if (fecha) fecha.textContent = d.toLocaleDateString(idioma, { weekday: "long", day: "numeric", month: "long" });
  }
  reloj(); setInterval(reloj, 10000);

  var mosaicos = Array.prototype.slice.call(document.querySelectorAll(".mosaico[aria-label]"));
  mosaicos.forEach(function (m) {
    m.addEventListener("click", function () { m.classList.toggle("girado"); });
  });
  // Mosaicos vivos: cada pocos segundos gira uno, como en el launcher.
  if (!quieto && mosaicos.length) {
    var i = 0;
    setInterval(function () {
      var m = mosaicos[i % mosaicos.length]; i++;
      m.classList.add("girado");
      setTimeout(function () { m.classList.remove("girado"); }, 2600);
    }, 3200);
  }

  var bicho = document.querySelector(".bicho-juego"), bocadillo = document.querySelector(".bocadillo");
  if (!bicho) return;
  var caja = bicho.closest(".mini-hopsie"), espera;
  if (!quieto && caja) {
    caja.addEventListener("pointermove", function (e) {
      if (bicho.classList.contains("tropieza")) return;
      var r = bicho.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      dx = Math.max(-1, Math.min(1, dx)); dy = Math.max(-1, Math.min(1, dy));
      bicho.style.transform = "translate(" + (dx * 10).toFixed(1) + "px," + (dy * 6).toFixed(1) + "px) rotate(" + (dx * 9).toFixed(1) + "deg)";
    });
    caja.addEventListener("pointerleave", function () { bicho.style.transform = ""; });
  }
  bicho.addEventListener("click", function () {
    bicho.style.transform = "";
    bicho.classList.remove("tropieza"); void bicho.offsetWidth; bicho.classList.add("tropieza");
    if (bocadillo) { bocadillo.textContent = bicho.getAttribute("data-oops"); bocadillo.classList.add("visible"); }
    clearTimeout(espera);
    espera = setTimeout(function () { bicho.classList.remove("tropieza"); if (bocadillo) bocadillo.classList.remove("visible"); }, 1300);
  });
})();
