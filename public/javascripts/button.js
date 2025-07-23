
const addBtns = document.querySelectorAll(".add-btn");
const removeBtns = document.querySelectorAll(".remove-btn");
const amounts = document.querySelectorAll(".amount");

addBtns.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        let value = Number(amounts[index].textContent);
        amounts[index].textContent = value + 1;
    });
});

removeBtns.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        let value = Number(amounts[index].textContent);

        if (value > 1) {
            amounts[index].textContent = value - 1;
        } else {

            window.location.href = `/removeFromCart/${index}`;
        }
    });
});
