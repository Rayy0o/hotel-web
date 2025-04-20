document.addEventListener('DOMContentLoaded', function() {
    // Slideshow functionality
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    setInterval(nextSlide, 5000);

    // Price calculator
    const roomTypeSelect = document.getElementById('room-type');
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const roomRateSpan = document.getElementById('room-rate');
    const nightsSpan = document.getElementById('nights');
    const totalPriceSpan = document.getElementById('total-price');

    const roomPrices = {
        standard: 150,
        deluxe: 250,
        suite: 350,
        presidential: 500
    };

    function calculatePrice() {
        const roomType = roomTypeSelect.value;
        const checkIn = new Date(checkInInput.value);
        const checkOut = new Date(checkOutInput.value);
        
        if (roomType && checkIn && checkOut && !isNaN(checkIn) && !isNaN(checkOut)) {
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            const price = roomPrices[roomType];
            const total = price * nights;

            roomRateSpan.textContent = `$${price}/night`;
            nightsSpan.textContent = nights;
            totalPriceSpan.textContent = `$${total}`;
        } else {
            roomRateSpan.textContent = '$0';
            nightsSpan.textContent = '0';
            totalPriceSpan.textContent = '$0';
        }
    }

    roomTypeSelect.addEventListener('change', calculatePrice);
    checkInInput.addEventListener('change', calculatePrice);
    checkOutInput.addEventListener('change', calculatePrice);

    // Room booking form handling
    const bookingForm = document.getElementById('roomBookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            const roomType = document.getElementById('room-type').value;
            const guests = document.getElementById('guests').value;
            const cardName = document.getElementById('card-name').value;
            const cardNumber = document.getElementById('card-number').value;
            const expiry = document.getElementById('expiry').value;
            const cvv = document.getElementById('cvv').value;

            // Validate dates
            if (new Date(checkIn) >= new Date(checkOut)) {
                alert('Check-out date must be after check-in date');
                return;
            }

            // Validate card number (Luhn algorithm)
            if (!validateCardNumber(cardNumber)) {
                alert('Please enter a valid card number');
                return;
            }

            // Validate expiry date
            if (!validateExpiryDate(expiry)) {
                alert('Please enter a valid expiry date (MM/YY)');
                return;
            }

            // Create booking object
            const booking = {
                checkIn,
                checkOut,
                roomType,
                guests,
                payment: {
                    cardName,
                    cardNumber: maskCardNumber(cardNumber),
                    expiry,
                    cvv: '***'
                },
                total: document.getElementById('total-price').textContent,
                timestamp: new Date().toISOString()
            };

            // In a real application, you would send this data to a server
            console.log('Booking submitted:', booking);
            alert('Booking confirmed! Thank you for choosing our hotel.');
            bookingForm.reset();
            calculatePrice(); // Reset price calculator
        });
    }

    // Card number formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) value = value.slice(0, 16);
            e.target.value = value;
        });
    }

    // Expiry date formatting
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });
    }

    // CVV formatting
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3) value = value.slice(0, 3);
            e.target.value = value;
        });
    }

    // Room details modal functionality
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(card => {
        const viewDetailsBtn = card.querySelector('.view-details-btn');
        viewDetailsBtn.addEventListener('click', function() {
            const roomType = card.getAttribute('data-room-type');
            showRoomDetails(roomType);
        });
    });

    function showRoomDetails(roomType) {
        // Create modal if it doesn't exist
        let modal = document.querySelector('.modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal';
            document.body.appendChild(modal);
        }

        // Room details data
        const roomDetails = {
            standard: {
                title: 'Standard Room',
                price: '$150/night',
                description: 'Our comfortable standard room offers a perfect blend of comfort and functionality. Ideal for business travelers and couples.',
                features: [
                    'Queen Size Bed',
                    'Free WiFi',
                    'Smart TV',
                    'Air Conditioning',
                    'Work Desk',
                    'Coffee Maker',
                    'Private Bathroom'
                ],
                size: '30 sqm'
            },
            deluxe: {
                title: 'Deluxe Room',
                price: '$250/night',
                description: 'Experience luxury in our deluxe rooms with premium amenities and stunning views.',
                features: [
                    'King Size Bed',
                    'Free WiFi',
                    'Smart TV',
                    'Air Conditioning',
                    'Bathtub',
                    'Mini Bar',
                    'Work Desk',
                    'Coffee Maker'
                ],
                size: '40 sqm'
            },
            suite: {
                title: 'Suite',
                price: '$350/night',
                description: 'Indulge in our spacious suites featuring separate living areas and premium amenities.',
                features: [
                    'King Size Bed',
                    'Free WiFi',
                    'Smart TV',
                    'Air Conditioning',
                    'Jacuzzi',
                    'Mini Bar',
                    'Living Area',
                    'Coffee Maker',
                    'Premium Toiletries'
                ],
                size: '60 sqm'
            },
            presidential: {
                title: 'Presidential Suite',
                price: '$500/night',
                description: 'Our most luxurious accommodation, offering unparalleled comfort and exclusive services.',
                features: [
                    'King Size Bed',
                    'Free WiFi',
                    'Smart TV',
                    'Air Conditioning',
                    'Jacuzzi',
                    'Mini Bar',
                    'Living Room',
                    'Private Gym',
                    'Butler Service',
                    'Premium Toiletries',
                    'Private Balcony'
                ],
                size: '100 sqm'
            }
        };

        const room = roomDetails[roomType];
        
        // Create modal content
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>${room.title}</h2>
                <p class="price">${room.price}</p>
                <p class="description">${room.description}</p>
                <div class="room-info">
                    <div class="room-features">
                        <h3>Features</h3>
                        <ul>
                            ${room.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="room-specs">
                        <h3>Specifications</h3>
                        <p><i class="fas fa-ruler"></i> Size: ${room.size}</p>
                        <p><i class="fas fa-users"></i> Max Occupancy: 2-4 guests</p>
                    </div>
                </div>
                <button class="book-this-room" data-room-type="${roomType}">Book This Room</button>
            </div>
        `;

        // Show modal
        modal.style.display = 'block';

        // Close modal when clicking the X
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Book this room button
        const bookButton = modal.querySelector('.book-this-room');
        bookButton.addEventListener('click', () => {
            document.getElementById('room-type').value = roomType;
            modal.style.display = 'none';
            document.querySelector('#booking').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Service request buttons handling
    const requestButtons = document.querySelectorAll('.request-btn');
    requestButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.closest('.service-card').querySelector('h3').textContent;
            alert(`Service request for ${service} has been submitted. We will contact you shortly.`);
        });
    });

    // Set minimum date for check-in to today
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('check-in');
    if (checkInInput) {
        checkInInput.min = today;
    }

    // Update check-out minimum date when check-in date changes
    if (checkInInput) {
        checkInInput.addEventListener('change', function() {
            const checkOutInput = document.getElementById('check-out');
            if (checkOutInput) {
                checkOutInput.min = this.value;
                if (checkOutInput.value && new Date(checkOutInput.value) <= new Date(this.value)) {
                    checkOutInput.value = '';
                }
            }
        });
    }

    // Helper functions
    function validateCardNumber(number) {
        // Luhn algorithm
        let sum = 0;
        let isEven = false;
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i));
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
            isEven = !isEven;
        }
        return sum % 10 === 0;
    }

    function validateExpiryDate(expiry) {
        const [month, year] = expiry.split('/');
        if (!month || !year) return false;
        
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const expiryYear = parseInt(year);
        const expiryMonth = parseInt(month);
        
        if (expiryYear < currentYear) return false;
        if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
        if (expiryMonth < 1 || expiryMonth > 12) return false;
        
        return true;
    }

    function maskCardNumber(number) {
        return '**** **** **** ' + number.slice(-4);
    }
}); 