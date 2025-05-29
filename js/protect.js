// Parse JWT token to extract role
function parseRole(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || (payload.roles && payload.roles[0]) || null;
  } catch {
    return null;
  }
}

// Protect a page by allowed roles
function protectPage(allowedRoles = []) {
  const token = sessionStorage.getItem("token");
  if (!token) {
    return window.location.href = "login.html";
  }

  const role = parseRole(token);
  if (!role || !allowedRoles.includes(role)) {
    const accessDeniedDiv = document.getElementById("access-denied");
    if (accessDeniedDiv) {
      accessDeniedDiv.style.display = "block";
      accessDeniedDiv.textContent = "🚫 Access Denied Only for super admin";
    } else {
      window.location.href = "unauthorized.html";
    }
  }
}

// Control visibility of elements based on role
function toggleVisibilityByRole(role) {
  document.querySelectorAll(".admin-only").forEach(el => {
    el.style.display = role === "super-admin" ? "block" : "none";
  });

  document.querySelectorAll(".user-only").forEach(el => {
    el.style.display = ["admin", "super-admin"].includes(role) ? "block" : "none";
  });
}

function restrictAdminPages(role) {
  const allowedPagesForAdmin = ["job.html", "view.html", "profile.html", "chat.html"];
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  if (role === "admin" && !allowedPagesForAdmin.includes(currentPage)) {
    // Clear page content
    document.body.innerHTML = "";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    // Create full-screen overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      background:  url('https://r4.wallpaperflare.com/wallpaper/849/282/378/anime-one-piece-monkey-d-luffy-wallpaper-b9c0287d01da3deb26d7382f00c1e63d.jpg') no-repeat center/cover;
      color: #00ffcc;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: 'Arial', sans-serif;
      text-align: center;
      z-index: 99999;
      animation: pulse 2s infinite ease-in-out;
      border: 5px solid #ff3366;
      box-sizing: border-box;
      animation: glow 1.2s infinite alternate;
    `;

    // Add CSS animations for pulse, glow, and text effects
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0% { background-color: rgba(0, 0, 0, 0.7); }
        50% { background-color: rgba(0, 0, 0, 0.85); }
        100% { background-color: rgba(0, 0, 0, 0.7); }
      }
      @keyframes glow {
        0% { border-color: #ff3366; box-shadow: 0 0 8px #ff3366; }
        100% { border-color: #00ffcc; box-shadow: 0 0 20px #00ffcc; }
      }
      @keyframes textPulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.9; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Countdown starts at 5
    let countdown = 5;

    overlay.innerHTML = `
      <h1 style="font-size: 32px; margin-bottom: 20px; animation: textPulse 1s infinite;">
        🔒 This Website Is Protected By <span style="color: #ff3366;">DARK Security</span>
      </h1>
      <p style="font-size: 20px; margin-bottom: 10px; animation: textPulse 1.2s infinite;">
        You'll be redirected to your home now XD
      </p>
      <p style="font-size: 18px;">
        Redirecting in: <span id="countdown" style="color: #ffcc00;">${countdown}</span>...
      </p>
      <p id="audioError" style="font-size: 16px; color: #ff3366; display: none;">
        Failed to play sound. Check your device or browser audio settings.
      </p>
    `;

    document.body.appendChild(overlay);

    // Initialize Web Audio API
    let audioCtx;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      // Attempt to resume AudioContext automatically
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch((e) => {
          console.error('Auto-resume failed:', e);
          document.getElementById('audioError').style.display = 'block';
        });
      }

      // Function to play short alert sound
      function playAlertSound(freq) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'triangle'; // Triangle wave for clear alert sound
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); // Moderate volume
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3); // Short 0.3s sound
      }

      // Countdown and redirect
      const frequencies = [440, 523.25, 659.25, 784, 880]; // A4, C5, E5, G5, A5
      const interval = setInterval(() => {
        countdown--;
        document.getElementById("countdown").textContent = countdown;

        // Play alert sound for each countdown number
        if (countdown > 0) {
          setTimeout(() => {
            playAlertSound(frequencies[countdown - 1] || 440); // Use different frequency for each number
          }, 50); // Slight delay to ensure audio context is ready
        }

        if (countdown <= 0) {
          clearInterval(interval);
          window.location.href = "profile.html"; // Immediate redirect
        }
      }, 1000);
    } catch (e) {
      // Show error message if audio fails
      document.getElementById('audioError').style.display = 'block';
      console.error('AudioContext initialization failed:', e);
    }
  }
}


// Run after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");
  if (!token) return window.location.href = "login.html";

  const role = parseRole(token);
  if (!role) return window.location.href = "unauthorized.html";

  // Optional: Apply page protection
  protectPage(["admin", "super-admin"]);

  // Control visibility of elements
  toggleVisibilityByRole(role);

  // Restrict admin from some pages
  restrictAdminPages(role);
});

// Export functions globally if needed
window.protect = { protectPage };
window.protectPage = protectPage;
window.parseRole = parseRole;