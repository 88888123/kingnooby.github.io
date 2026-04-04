// 3D tilt effect
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = ((y / rect.height) - 0.5) * -12;
        const rotateY = ((x / rect.width) - 0.5) * 12;

        card.style.transform =
            `translateY(-12px) scale(1.04) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform =
            'translateY(0) scale(1) rotateX(0) rotateY(0)';
    });
});

// PAGE FADE-OUT TRANSITION
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', e => {
        e.preventDefault();

        // Extract the link from onclick="'page1.html'"
        const link = card.getAttribute('onclick').replace(/'/g, "");

        document.body.classList.add('fade-out');

        setTimeout(() => {
            window.location.href = link;
        }, 400);
    });
});

