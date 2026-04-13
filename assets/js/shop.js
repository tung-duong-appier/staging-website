(function () {
	'use strict';

	var cart = [];

	var $minicart = document.getElementById('minicart');
	var $overlay = document.getElementById('cart-overlay');
	var $cartItems = document.getElementById('cart-items');
	var $cartCount = document.getElementById('cart-count');
	var $cartTotal = document.getElementById('cart-total');
	var $cartToggle = document.getElementById('cart-toggle');
	var $closeCart = document.getElementById('close-cart');

	function openCart() {
		$minicart.classList.add('open');
		$overlay.classList.add('active');
	}

	function closeCart() {
		$minicart.classList.remove('open');
		$overlay.classList.remove('active');
	}

	function getCartTotal() {
		return cart.reduce(function (sum, item) {
			return sum + item.price * item.qty;
		}, 0);
	}

	function getCartCount() {
		return cart.reduce(function (sum, item) {
			return sum + item.qty;
		}, 0);
	}

	function renderCart() {
		$cartCount.textContent = getCartCount();
		$cartTotal.textContent = '$' + getCartTotal().toFixed(2);

		if (cart.length === 0) {
			$cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
			return;
		}

		var html = '';
		cart.forEach(function (item, index) {
			html += '<div class="cart-item">' +
				'<img src="' + item.img + '" alt="' + item.name + '">' +
				'<div class="cart-item-details">' +
					'<div class="cart-item-name">' + item.name + '</div>' +
					'<div class="cart-item-price">$' + item.price.toFixed(2) + '</div>' +
					'<div class="cart-item-qty">' +
						'<button class="qty-minus" data-index="' + index + '">-</button>' +
						'<span>' + item.qty + '</span>' +
						'<button class="qty-plus" data-index="' + index + '">+</button>' +
					'</div>' +
				'</div>' +
				'<button class="cart-item-remove" data-index="' + index + '" title="Remove">&times;</button>' +
			'</div>';
		});

		$cartItems.innerHTML = html;
	}

	function addToCart(name, price, img) {
		for (var i = 0; i < cart.length; i++) {
			if (cart[i].name === name) {
				cart[i].qty++;
				renderCart();
				openCart();
				return;
			}
		}
		cart.push({ name: name, price: parseFloat(price), img: img, qty: 1 });
		renderCart();
		openCart();
	}

	// Add to cart buttons
	document.addEventListener('click', function (e) {
		var btn = e.target.closest('.add-to-cart');
		if (btn) {
			e.preventDefault();
			var name = btn.getAttribute('data-name');
			var price = btn.getAttribute('data-price');
			var img = btn.getAttribute('data-img');
			addToCart(name, price, img);

			// Brief visual feedback
			var card = btn.closest('.product-card');
			var originalText = btn.textContent;
			btn.textContent = 'Added!';
			card.classList.add('added');
			setTimeout(function () {
				btn.textContent = originalText;
				card.classList.remove('added');
			}, 800);
		}
	});

	// Cart item quantity and remove
	$cartItems.addEventListener('click', function (e) {
		var idx;
		if (e.target.classList.contains('qty-plus')) {
			idx = parseInt(e.target.getAttribute('data-index'));
			cart[idx].qty++;
			renderCart();
		} else if (e.target.classList.contains('qty-minus')) {
			idx = parseInt(e.target.getAttribute('data-index'));
			if (cart[idx].qty > 1) {
				cart[idx].qty--;
			} else {
				cart.splice(idx, 1);
			}
			renderCart();
		} else if (e.target.classList.contains('cart-item-remove')) {
			idx = parseInt(e.target.getAttribute('data-index'));
			cart.splice(idx, 1);
			renderCart();
		}
	});

	// Toggle cart
	$cartToggle.addEventListener('click', function (e) {
		e.preventDefault();
		e.stopPropagation();
		if ($minicart.classList.contains('open')) {
			closeCart();
		} else {
			openCart();
		}
	});

	$closeCart.addEventListener('click', closeCart);
	$overlay.addEventListener('click', closeCart);

	// Initialize
	renderCart();
})();
