$(document).ready(function() {
    // Initialize variables
    let currentSlide = 0;
    const slides = $('.da-slide');
    const totalSlides = slides.length;
    const slideInterval = 5000; // Auto-slide every 5 seconds
    let autoSlide;

    // Show the first slide
    slides.eq(currentSlide).addClass('active');

    // Navigation functions
    function goToSlide(index) {
        slides.removeClass('active').eq(index).addClass('active');
        currentSlide = index;
        updateArrows();
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prevIndex);
    }

    // Update arrow states
    function updateArrows() {
        $('.da-arrows-prev, .da-arrows-next').removeClass('disabled');
        if (currentSlide === 0) $('.da-arrows-prev').addClass('disabled');
        if (currentSlide === totalSlides - 1) $('.da-arrows-next').addClass('disabled');
    }

    // Arrow click events
    $('.da-arrows-prev').on('click', function() {
        if (!$(this).hasClass('disabled')) prevSlide();
    });

    $('.da-arrows-next').on('click', function() {
        if (!$(this).hasClass('disabled')) nextSlide();
    });

    // Auto-slide functionality
    function startAutoSlide() {
        autoSlide = setInterval(nextSlide, slideInterval);
    }

    function stopAutoSlide() {
        clearInterval(autoSlide);
    }

    // Start auto-slide on load
    startAutoSlide();

    // Pause on hover
    $('.da-slider').hover(
        function() {
            stopAutoSlide();
        },
        function() {
            startAutoSlide();
        }
    );

    // Keyboard navigation
    $(document).on('keydown', function(e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
});