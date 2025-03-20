document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelector(".slides");
  const slideItems = document.querySelectorAll(".slides > div");
  let currentIndex = 0;
  const totalSlides = slideItems.length;
  const slideWidth = slideItems[0].offsetWidth; // Get width of a single slide
  const intervalTime = 3000; // Change slide every 3 seconds

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides; // Loop back to first slide
    slides.scrollTo({
      left: slideWidth * currentIndex,
      behavior: "smooth",
    });
  }

  // Start automatic sliding
  setInterval(nextSlide, intervalTime);
});
