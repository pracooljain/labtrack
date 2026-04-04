
    document.addEventListener("DOMContentLoaded", function() {
    const cookieBanner = document.getElementById("cookieConsentBanner");
    const acceptBtn = document.getElementById("acceptCookies");

    if (!localStorage.getItem("cookieConsentAccepted")) {
        cookieBanner.style.display = "block";
    }

    acceptBtn.addEventListener("click", function() {
        localStorage.setItem("cookieConsentAccepted", "true");
        cookieBanner.style.display = "none";
    });
})