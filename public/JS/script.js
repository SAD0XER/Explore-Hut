// Function for form validation.
(() => {
    "use strict";

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll(".needs-validation");

    // Loop over them and prevent submission
    Array.from(forms).forEach((form) => {
        form.addEventListener(
            "submit",
            (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add("was-validated");
            },
            false,
        );
    });
})();

// JavaScript for Category Slider Buttons.
// const slider = document.getElementById('slider');
// const leftBtn = document.querySelector('.left-nav-arrow');
// const rightBtn = document.querySelector('.right-nav-arrow');

// const scrollAmount = 300;

// rightBtn.addEventListener('click', () => {
//     slider.scrollLeft += scrollAmount;
// });

// leftBtn.addEventListener('click', () => {
//     slider.scrollLeft -= scrollAmount;
// });

// JavaScript for Category Slider Buttons
const slider = document.getElementById('slider');
const leftBtn = document.querySelector('.left-nav-arrow');
const rightBtn = document.querySelector('.right-nav-arrow');

const scrollAmount = 300;

// Function to toggle arrow visibility
function updateArrowVisibility() {
    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

    leftBtn.style.display = slider.scrollLeft > 0 ? 'block' : 'none';
    rightBtn.style.display = slider.scrollLeft < maxScrollLeft ? 'block' : 'none';
}

// Scroll event listeners
rightBtn.addEventListener('click', () => {
    slider.scrollLeft += scrollAmount;
    setTimeout(updateArrowVisibility, 500); // slight delay for smooth transition
});

leftBtn.addEventListener('click', () => {
    slider.scrollLeft -= scrollAmount;
    setTimeout(updateArrowVisibility, 500);
});

// Trigger check on scroll and load
slider.addEventListener('scroll', updateArrowVisibility);
window.addEventListener('load', updateArrowVisibility);


// JavaScript for Tax Switch Toggle.
let taxSwitchToggle = document.getElementById("flexSwitchCheckDefault");
let texSwitchToggle = () => {
    let taxInfo = document.getElementsByClassName("tax-info");
    for (info of taxInfo) {
        if (taxSwitchToggle.checked) info.style.display = "inline";
        else info.style.display = "none";
    }
};
