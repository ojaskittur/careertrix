const chars = "0123456789";

const randomChar = () => chars[Math.floor(Math.random() * (chars.length - 1))],
      randomString = length => Array.from(Array(length)).map(randomChar).join("");

const card = document.querySelector(".card"),
      letters = card.querySelector(".card-letters");

const handleOnMove = (x, y) => {
  letters.style.setProperty("--x", `${x}px`);
  letters.style.setProperty("--y", `${y}px`);
  letters.innerText = randomString(10000);
};

// Check if the device supports touch (mobile)
const isMobile = 'ontouchstart' in window;

if (isMobile) {
  // Mobile: Continuous loop for the effect
  let x = 0, y = 0;
  const speed = 0.0000000001; // Reduced speed for a smoother effect

  const animate = () => {
    x = (x + speed) % card.offsetWidth; // Move horizontally
    y = (y + speed) % card.offsetHeight; // Move vertically
    handleOnMove(x, y);
    requestAnimationFrame(animate); // Loop
  };

  animate(); // Start the animation
} else {
  // Desktop: Use mouse/touch movement
  card.onmousemove = e => handleOnMove(e.clientX - card.getBoundingClientRect().left, e.clientY - card.getBoundingClientRect().top);
  card.ontouchmove = e => handleOnMove(e.touches[0].clientX - card.getBoundingClientRect().left, e.touches[0].clientY - card.getBoundingClientRect().top);
}

// Rest of your code remains unchanged
const container = document.querySelector('.container');
const SignInLink = document.querySelector('.SignInLink');
const SignUpLink = document.querySelector('.SignUpLink');

SignUpLink.addEventListener('click', () => {
    container.classList.add('active');
});

SignInLink.addEventListener('click', () => {
    container.classList.remove('active');
});

function updateTimeDate() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let date;

    if (window.innerWidth <= 768) {
        // Mobile view: Format as "TUE, FEB 11, 25"
        const day = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const month = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const dayNum = now.getDate();
        const year = now.getFullYear().toString().slice(-2);

        date = `${day}, ${month} ${dayNum}, ${year}`;
    } else {
        // Default format for desktop
        date = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }

    document.getElementById('time').textContent = time;
    document.getElementById('date').textContent = date;
}

// Run on load and update every minute
updateTimeDate();
setInterval(updateTimeDate, 60000);

// Ensure the date format updates when resizing the screen
window.addEventListener('resize', updateTimeDate);

document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('togglePassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const logPassword = document.getElementById('logpassword');
    const loginPasswordToggle = document.getElementById('loginPassword');
    const repeatPassword = document.getElementById('repPassword');
    const repeatPasswordToggle = document.getElementById('repeatPassword');
    const errorMessage = document.getElementById("error-message");
    const errorContainer = document.getElementById("error-container");

    if (loginPasswordToggle && logPassword) {
        loginPasswordToggle.addEventListener('click', () => {
            const type = logPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            logPassword.setAttribute('type', type);
            loginPasswordToggle.classList.toggle('bxs-lock-alt');
            loginPasswordToggle.classList.toggle('bxs-lock-open-alt');
        });
    }

    if (togglePassword && confirmPassword) {
        togglePassword.addEventListener('click', () => {
            const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPassword.setAttribute('type', type);
            togglePassword.classList.toggle('bxs-lock-alt');
            togglePassword.classList.toggle('bxs-lock-open-alt');
        });
    }

    if (repeatPasswordToggle && repeatPassword) {
        repeatPasswordToggle.addEventListener('click', () => {
            const type = repeatPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            repeatPassword.setAttribute('type', type);
            repeatPasswordToggle.classList.toggle('bxs-lock-alt');
            repeatPasswordToggle.classList.toggle('bxs-lock-open-alt');
        });
    }

    function showError(message) {
        errorMessage.innerText = message;
        errorContainer.style.display = 'block';
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }
});
