let navbar = document.querySelector(".nav-links");
let menuIcon = document.querySelector(".menu-icon");
// window.addEventListener("click", () => {
//     // navbar.classList.toggle("active");
//     // menuIcon.classList.toggle("active");
//     menuIcon.textContent = menuIcon.classList.contains("active") ? "✖" : "☰";

// })
menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("active");
    menuIcon.classList.toggle("active");
    menuIcon.textContent = menuIcon.classList.contains("active") ? "✖" : "☰";
})
document.querySelectorAll(".nav-links li a").forEach(btn => {
    btn.addEventListener("click", () => {
        navbar.classList.remove("active");
        menuIcon.classList.remove("active");
        menuIcon.textContent = "☰";
    });
});
//price converter
const visibleSlides = document.querySelectorAll(".visiblePart");
visibleSlides.forEach(card => {

    const priceSelect = card.querySelector(".price-select");
    const priceEl = card.querySelector(".price");
    const originalUSD = parseFloat(priceEl.textContent.replace("$", ""));
    priceSelect.addEventListener("change", () => {
        if (priceSelect.value === "ETB") {
            let etb = originalUSD * 154;
            priceEl.textContent = `ETB ${etb.toFixed(2)}`;
        } else {
            priceEl.textContent = `$${originalUSD.toFixed(2)}`;
        }
    });


});
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
const wishlistCount = document.querySelector(".wishlist-count");

function updateWishlistCount() {
    wishlistCount.textContent = wishlist.length;
}
updateWishlistCount();
const visibleCards = document.querySelectorAll(".visiblePart");

visibleCards.forEach(card => {
    const icon = card.querySelector(".wishlist-icon");
    if (!icon) return;

    icon.addEventListener("click", () => {
        const productId = icon.getAttribute("data-product-id");
        const heart = icon.querySelector(".heart");

        heart.classList.toggle("active");

        if (heart.classList.contains("active")) {
            if (!wishlist.includes(productId)) {
                wishlist.push(productId);
            }
        } else {
            wishlist = wishlist.filter(id => id !== productId);
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        updateWishlistCount();
    });
});
const productCards = document.querySelectorAll(".product-card");

productCards.forEach(card => {

    const priceSelect = card.querySelector(".price-select");
    const priceEl = card.querySelector(".price");

    const originalUSD = parseFloat(priceEl.textContent.replace("$", ""));

    priceSelect.addEventListener("change", () => {
        if (priceSelect.value === "ETB") {
            let etb = originalUSD * 154;
            priceEl.textContent = `ETB ${etb.toFixed(2)}`;
        } else {
            priceEl.textContent = `$${originalUSD.toFixed(2)}`;
        }
    });

});


//product filter
const all_btn = document.querySelector('.current');
const buttons = document.querySelectorAll('.filter-btn');
const slides = document.querySelectorAll('.swiper-slide');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category.toLowerCase();
        buttons.forEach(b => b.classList.remove('active'),
            all_btn.classList.remove("current")
        );
        btn.classList.add('active');
        slides.forEach(slide => {
            const card = slide.querySelector('.product-card');
            const cardCat = card && card.dataset.category && card.dataset.category.toLowerCase();
            if (category === 'all' || cardCat === category) {
                slide.classList.remove('hidden');
            } else {
                slide.classList.add('hidden');
            }
        });
        setTimeout(() => {
            if (typeof swiper !== 'undefined') {
                swiper.update();
                const visibleSlides = Array.from(document.querySelectorAll('.swiper-slide'))
                    .filter(s => !s.classList.contains('hidden'));
                if (visibleSlides.length > 0) {
                    const firstVisible = visibleSlides[0];
                    const firstIndex = Array.from(swiper.slides).indexOf(firstVisible);
                    swiper.slideTo(firstIndex, 0);
                }
            }
        }, 300);
    });
});

let form = document.getElementById("contactForm");
let popup = document.getElementById("popup");
let popupMessage = document.getElementById("popupMessage");
let closePopup = document.getElementById("closePopup");
form.addEventListener("submit", async(e) => {
    e.preventDefault();
    let name = form.elements["name"].value.trim();
    let phone = form.elements["phone"].value.trim();
    let email = form.elements["email"].value.trim();
    let message = form.elements["message"].value.trim();
    const sendBtn = document.getElementById("sendBtn");
    const btnText = sendBtn.querySelector(".btn-text");
    const spinner = sendBtn.querySelector(".spinner");
    // Disable button and show spinner
    sendBtn.disabled = true;
    btnText.textContent = "Sending...";
    spinner.classList.remove("hidden");

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let cartSummary = "";
    cartItems.forEach(item => {
        cartSummary += `${item.title} - ${item.quantity} x ${item.price}\n`;
    });
    const total = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace("$", ""));
        return sum + price * item.quantity;
    }, 0);
    const payload = {
        name: name,
        phone: phone,
        email: email,
        message: message,
        // cartSummary,
        total: `$${total.toFixed(2)}`,
        cartItems: cartItems
    };
    const nameError = document.querySelector(".nameError");
    const phoneError = document.querySelector(".phoneError");
    const emailError = document.querySelector(".emailError");
    const messageError = document.querySelector(".messageError");
    let overlay = document.getElementById("overlay");

    document.querySelectorAll(".error").forEach(el => el.textContent = "");
    document.querySelectorAll("input, textarea").forEach(el => el.classList.remove("error-border"));
    let isValid = true;
    if (name.length < 3) {
        nameError.textContent = "Name must be at least 3 characters.";
        nameError.style.display = "block";
        this.name.classList.add("error-border");
        isValid = false;
    }
    const phoneRegex = /^(?:\+2519\d{8}|09\d{8}|07\d{8})$/;
    if (!phoneRegex.test(phone)) {
        phoneError.textContent = "Enter a valid Ethiopian phone number (+2519... or 09...0r 07...).";
        phoneError.style.display = "block";
        this.phone.classList.add("error-border");
        isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        emailError.style.display = "block";
        this.email.classList.add("error-border");
        isValid = false;
    }
    if (message.length < 5) {
        messageError.textContent = "Message must be at least 5 characters.";
        git
        messageError.style.display = "block";
        this.message.classList.add("error-border");
        isValid = false;
    }
    const response = await fetch("/sendMail", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (data.status === "success") {
        popupMessage.textContent = `Thank you, ${name}! Your message was received 💌`;
        popup.style.display = "block";
        popup.classList.add("active");
        document.body.classList.add("no-scroll");
        overlay.classList.remove("overLay-background")
        localStorage.removeItem("cartItems");
        document.querySelector(".errorImg").style.display = "none";
        document.querySelector(".successImg").style.marginTop = "-12%";
        document.querySelector(".successImg").style.boxShadow = "none";
        document.querySelector(".successImg").style.display = "block";

        popup.style.width = "300px";
        popup.style.height = "auto";

        closePopup.style.backgroundColor = "#27ae60";
    } else {
        document.querySelector(".errorImg").style.display = "block";

    }
    sendBtn.disabled = false;
    btnText.textContent = "Send Message";
    spinner.classList.add("hidden");
    closePopup.addEventListener("click", () => {
        popup.style.display = "none";
        popup.classList.remove("active");
        form.reset();
        document.body.classList.remove("no-scroll");
        overlay.classList.add("overLay-background")
    });
});

//cart togle
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
const cartCount = document.querySelector(".cart-item-count");

cartIcon.addEventListener("click", () => {
    // cartCount.style.visibility = "hidden";
    // cartIcon.style.visibility = "hidden";
    // cartIcon.style.transition = "0.2s";
    // cartCount.style.transition = "0.2s";
    cart.classList.add("active");
    overlay.classList.remove("overLay-background")
    document.body.classList.add("no-scroll");
});
cartClose.addEventListener("click", () => {
    // cartCount.style.visibility = "visible";
    // cartIcon.style.visibility = "visible";
    // cartIcon.style.transition = "0.2s";
    // cartCount.style.transition = "0.2s";
    cart.classList.remove("active")
    overlay.classList.add("overLay-background")
    document.body.classList.remove("no-scroll");


});

const addCartButtons = document.querySelectorAll(".add-to-cart");
const cartContent = document.querySelector(".cart-content");
let cartItemCount = 0;
document.addEventListener("DOMContentLoaded", () => {
    loadCartFromLocalStorage();
    updateTotalPrice();
});
addCartButtons.forEach(button => {
    button.addEventListener("click", event => {
        const productBox = event.target.closest(".product-card");
        addToCart(productBox);
    });
});
const addToCart = productBox => {
        const productImgSrc = productBox.querySelector("img").src;
        const productTitle = productBox.querySelector("h3").textContent;
        const productPrice = productBox.querySelector(".price").textContent;
        const cartItems = document.querySelectorAll(".cart-product-title");
        for (let item of cartItems) {
            if (item.textContent === productTitle) {
                popup.style.width = "300px";
                document.querySelector(".popup img").style.display = "none";
                popupMessage.textContent = `Item already in cart.You can change quantity in cart!`;
                popup.style.display = "block";
                popup.classList.add("active");
                document.body.classList.add("no-scroll");
                overlay.classList.remove("overLay-background")
                closePopup.style.backgroundColor = "#e23323";
                closePopup.addEventListener("click", () => {
                    popup.style.display = "none";
                    popup.classList.remove("active");
                    document.body.classList.remove("no-scroll");
                    overlay.classList.add("overLay-background")
                });
                return;
            }
            let cart = [{
                "product-Title": productTitle,
                "product-Price": productPrice,
                "product-Image": productImgSrc
            }];
            localStorage.setItem("cartItems", JSON.stringify(cart));
        }
        const cartBox = document.createElement("div");
        cartBox.classList.add("cart-box");
        cartBox.innerHTML = `
        <img src="${productImgSrc}" alt="added product" class="cart-img">
        <div class="cart-detail">
            <h2 class="cart-product-title">${productTitle}</h2>
            <span class="cart-price">${productPrice}</span>
            <div class="cart-quantity">
                <button id="decrement">-</button>
                <span class="number">1</span>
                <button id="increment">+</button>
            </div>
        </div>
        <i class="ri-delete-bin-line cart-remove"></i>
    `;


        cartContent.appendChild(cartBox);

        cartBox.querySelector(".cart-remove").addEventListener("click", () => {
            cartBox.remove();
            updateCartCount(-1);
            updateTotalPrice();
            saveCartToLocalStorage();
        });
        cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
            const decrementButton = cartBox.querySelector("#decrement");
            const numberButton = cartBox.querySelector(".number");
            let quantity = parseInt(numberButton.textContent);
            if (event.target.id === "decrement" && quantity > 1) {
                quantity--;
                if (quantity === 1) {
                    decrementButton.style.color = "#999";
                }
            } else if (event.target.id === "increment") {
                quantity++;
                decrementButton.style.color = "#333";
            }
            numberButton.textContent = quantity;
            updateTotalPrice();
            saveCartToLocalStorage();

        });
        updateCartCount(1);
        updateTotalPrice();
        saveCartToLocalStorage();

    }
    //save to local stoarge
const updateTotalPrice = () => {
        const totalPriceElement = document.querySelector(".total-price");
        const cartBoxes = cartContent.querySelectorAll(".cart-box");
        let total = 0;
        cartBoxes.forEach(cartBox => {
            const PriceElement = cartBox.querySelector(".cart-price");
            const quantityElement = cartBox.querySelector(".number");
            const price = parseFloat(PriceElement.textContent.replace("$", ""));
            const quantity = parseInt(quantityElement.textContent);
            total += price * quantity;
        });
        totalPriceElement.textContent = `$${total.toFixed(2)}`;
    }
    //save to local storage
function saveCartToLocalStorage() {
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    const cartItems = [];
    cartBoxes.forEach(cartBox => {
        const title = cartBox.querySelector(".cart-product-title").textContent;
        const price = cartBox.querySelector(".cart-price").textContent;
        const img = cartBox.querySelector(".cart-img").getAttribute("src") || "";
        const imgName = img.split("/").pop();
        const quantity = cartBox.querySelector(".number").textContent;

        cartItems.push({ title, price, imgName, quantity });
    });
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

};
//load saved items
function loadCartFromLocalStorage() {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    savedCart.forEach(item => {
        const cartBox = document.createElement("div");
        cartBox.classList.add("cart-box");
        cartBox.innerHTML = `
            <img src="${item.imgName}" alt="added product" class="cart-img">
            <div class="cart-detail">
                <h2 class="cart-product-title">${item.title}</h2>
                <span class="cart-price">${item.price}</span>
                <div class="cart-quantity">
                    <button id="decrement">-</button>
                    <span class="number">${item.quantity}</span>
                    <button id="increment">+</button>
                </div>
            </div>
            <i class="ri-delete-bin-line cart-remove"></i>
        `;

        cartContent.appendChild(cartBox);
        cartBox.querySelector(".cart-remove").addEventListener("click", () => {
            cartBox.remove();
            updateCartCount(-1);
            updateTotalPrice();
            saveCartToLocalStorage();
        });

        cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
            const decrementButton = cartBox.querySelector("#decrement");
            const numberButton = cartBox.querySelector(".number");
            let quantity = parseInt(numberButton.textContent);

            if (event.target.id === "decrement" && quantity > 1) {
                quantity--;
                if (quantity === 1) {
                    decrementButton.style.color = "#999";
                }
            } else if (event.target.id === "increment") {
                quantity++;
                decrementButton.style.color = "#333";
            }

            numberButton.textContent = quantity;
            updateTotalPrice();
            saveCartToLocalStorage();
        });
    });

    cartItemCount = savedCart.length;
    updateCartCount(0);
}
//update cart count
const cartItemCountBadge = document.querySelector(".cart-item-count");
const updateCartCount = change => {
        cartItemCount += change;
        if (cartItemCount > 0) {
            cartItemCountBadge.style.visibility = "visible";
            cartItemCountBadge.textContent = cartItemCount;

        } else {
            cartItemCountBadge.style.visibility = "hidden";
            cartItemCountBadge.textContent = "";
        }
    }
    //buy now button
const buyNowButton = document.querySelector(".btn-buy");
buyNowButton.addEventListener("click", () => {
    document.body.classList.remove("no-scroll");
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (cartItems.length === 0) {
        popup.style.width = "300px";
        popup.style.height = "auto";
        document.querySelector(".successImg").style.display = "none";
        document.querySelector(".errorImg").style.marginTop = "-12%";
        document.querySelector(".errorImg").style.boxShadow = "none";
        document.querySelector(".errorImg").style.width = "60px";
        popupMessage.textContent = ` Your cart is empty.add item before buying.Thanks!`;
        popup.style.display = "block";
        popup.classList.add("active");
        document.body.classList.add("no-scroll");
        overlay.classList.remove("overLay-background")
        closePopup.style.backgroundColor = "#e23323";
        cart.style.zIndex = "999";
        closePopup.addEventListener("click", () => {
            popup.style.display = "none";
            popup.classList.remove("active");
            cart.style.zIndex = "10001";

            // document.body.classList.remove("no-scroll");
            // overlay.classList.add("overLay-background")
        });
        return;
    } else {
        overlay.classList.add("overLay-background")


    }
    let cartSummary = "Your order details:\n\n";
    cartItems.forEach(item => {
        cartSummary += `${item.title} - ${item.quantity} x ${item.price}\n`;
    });

    const total = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace("$", ""));
        return sum + price * item.quantity;
    }, 0);

    cartSummary += `\nTotal: $${total.toFixed(2)}\n\nThank you for your purchase!`;
    console.log(cartSummary);
    cartBoxes.forEach(cartBox => cartBox.remove());
    cartItemCount = 0;
    updateCartCount(0);
    updateTotalPrice();
    cartContent.innerHTML = "";
    location.href = "#contact";
    cart.classList.remove("active")
    cartItemCountBadge.style.visibility = "hidden";
});