const toCurrency = (price) => {
    return new Intl.NumberFormat("ru-RU", {
        currency: "uah",
        style: "currency"
    }).format(price)
}

document.querySelectorAll(".price").forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

const $cart = document.querySelector("#cart")
if ($cart) {
    $cart.addEventListener("click", (event) => {
        let targetEl = event.target;

        if (targetEl.classList.contains("material-icons")) {
            targetEl = targetEl.parentElement;
        }

        if (targetEl.classList.contains("js-remove")) {
            const id = targetEl.dataset.id;

            fetch(`/cart/remove/${id}`, {
                method: "DELETE"
            })
                .then(res => res.json())
                .then(cart => {
                    if (cart.courses.length) {
                        const html = cart.courses.map(c => {
                            return `<div class="head-row">
                                <div class="row-col">${c.title}</div>
                                <div class="row-col">${c.count}</div>
                                <div class="row-col text-right">
                                    <button class="btn btn-small js-remove" data-id="${c.id}">
                                        <i class="material-icons">delete</i>
                                    </button>
                                </div>
                            </div>`
                        }).join("")

                        $cart.querySelector(".cart-body").innerHTML = html;
                        $cart.querySelector(".total-price").innerHTML = toCurrency(cart.price);
                    } else {
                        $cart.innerHTML = "<div>\n" +
                            "        Cart is empty.\n" +
                            "        Want to buy smth? Go to  <a href=\"/courses\">courses</a>\n" +
                            "    </div>"
                    }
                })
        }
    }, {capture: true})
}