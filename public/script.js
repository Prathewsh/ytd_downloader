// ===== Quality Selection =====
const qualityButtons = document.querySelectorAll('.qualityBtn');
let selectedQuality = 'best'; // Default quality

qualityButtons.forEach(button => {
    button.addEventListener('click', () => {
        qualityButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedQuality = button.getAttribute('data-quality');
    });
});

// ===== Form Submission =====
document.getElementById('downloadForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const url = document.getElementById('videoURL').value.trim();
    const message = document.getElementById('message');
    const loader = document.getElementById('loader');

    if (!url) {
        message.textContent = 'Please enter a valid YouTube URL.';
        return;
    }

    message.textContent = 'Preparing download...';
    loader.style.display = 'block';

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, quality: selectedQuality })
        });

        if (!response.ok) {
            throw new Error('Failed to download. Please try again.');
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'video.mp4';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);

        message.textContent = 'Download completed!';
    } catch (error) {
        message.textContent = `Error: ${error.message}`;
    } finally {
        loader.style.display = 'none';
    }
});

// ===== Dark Mode Toggle =====
const darkModeToggle = document.getElementById('darkModeToggle');

// Load saved mode from localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
});
