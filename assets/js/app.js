document.addEventListener('DOMContentLoaded', () => {
    const customerTable = document.getElementById('customerTable');
    const customerForm = document.getElementById('customerForm');
    const customerModal = new bootstrap.Modal(document.getElementById('customerModal'));
    const addCustomerBtn = document.getElementById('addCustomer');
    const showEntriesSelect = document.getElementById('showEntries');
    const searchInput = document.getElementById('search');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const paginationNumbers = document.getElementById('paginationNumbers');

    let customers = [
        { trackingId: "20462", product: "Hat", customer: "Matt Dickerson", date: "2022-05-13", amount: 4.95, paymentMode: "Transfer Bank", status: "Delivered", imageUrl: "assets/images/hat.jpeg" },
        { trackingId: "18933", product: "Laptop", customer: "Wiktoria", date: "2022-05-22", amount: 8.95, paymentMode: "Cash on Delivery", status: "Delivered", imageUrl: "assets/images/laptop.jpeg" },
        { trackingId: "45169", product: "Phone", customer: "Trixie Byrd", date: "2022-06-15", amount: 1149.95, paymentMode: "Cash on Delivery", status: "Process", imageUrl: "assets/images/phone.jpeg" },
        { trackingId: "34034", product: "Bag", customer: "Brad Mason", date: "2022-09-06", amount: 899.95, paymentMode: "Transfer Bank", status: "Process", imageUrl: "assets/images/bag.jpeg" },
        { trackingId: "17888", product: "Headset", customer: "Sanderson", date: "2022-09-25", amount: 22.95, paymentMode: "Cash on Delivery", status: "Canceled", imageUrl: "assets/images/headset.jpeg" },
        { trackingId: "79003", product: "Mouse", customer: "Jun Redfern", date: "2022-10-04", amount: 54.95, paymentMode: "Transfer Bank", status: "Delivered", imageUrl: "assets/images/mouse.jpeg" },
        { trackingId: "71633", product: "Clock", customer: "Miriam Kidd", date: "2022-10-17", amount: 174.95, paymentMode: "Transfer Bank", status: "Delivered", imageUrl: "assets/images/clock.jpeg" },
        { trackingId: "44122", product: "T-shirt", customer: "Dominic", date: "2022-10-24", amount: 249.95, paymentMode: "Transfer Bank", status: "Process", imageUrl: "assets/images/T-shirt.jpeg" },
        { trackingId: "89094", product: "Monitor", customer: "Shanice", date: "2022-11-01", amount: 899.95, paymentMode: "Transfer Bank", status: "Canceled", imageUrl: "assets/images/monitor.jpeg" },
        { trackingId: "85252", product: "Keyboard", customer: "Poppy-Rose", date: "2022-07-22", amount: 6.94, paymentMode: "Transfer Bank", status: "Delivered", imageUrl: "assets/images/keyboard.jpeg" },
    ];

    let currentPage = 1;
    let rowsPerPage = parseInt(showEntriesSelect.value);

    function renderTable() {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const filteredCustomers = customers.slice(start, end);
        customerTable.innerHTML = '';

        filteredCustomers.forEach((customer, index) => {
            customerTable.innerHTML += `
                <tr>
                    <td>${customer.trackingId}</td>
                    <td><img src="${customer.imageUrl}" alt="${customer.product}" width="30"> ${customer.product}</td>
                    <td>${customer.customer}</td>
                    <td>${customer.date}</td>
                    <td>${customer.amount}</td>
                    <td>${customer.paymentMode}</td>
                    <td><span class="status-${customer.status.toLowerCase()}">${customer.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editCustomer(${start + index})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${start + index})"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });

        checkPaginationButtons();
        renderPaginationNumbers();
    }

    function renderPaginationNumbers() {
        const totalPages = Math.ceil(customers.length / rowsPerPage);
        paginationNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            paginationNumbers.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" onclick="goToPage(${i})">${i}</a></li>`;
        }
    }

    function goToPage(page) {
        currentPage = page;
        renderTable();
    }

    function checkPaginationButtons() {
        prevPageBtn.parentElement.classList.toggle('disabled', currentPage === 1);
        nextPageBtn.parentElement.classList.toggle('disabled', currentPage * rowsPerPage >= customers.length);
    }

    window.editCustomer = function (index) {
        const customer = customers[index];
        document.getElementById('trackingId').value = customer.trackingId;
        document.getElementById('product').value = customer.product;
        document.getElementById('customer').value = customer.customer;
        document.getElementById('date').value = customer.date;
        document.getElementById('amount').value = customer.amount;
        document.getElementById('paymentMode').value = customer.paymentMode;
        document.getElementById('status').value = customer.status;

        customerModal.show();

        customerForm.onsubmit = (e) => {
            e.preventDefault();
            customers[index] = {
                trackingId: document.getElementById('trackingId').value,
                product: document.getElementById('product').value,
                customer: document.getElementById('customer').value,
                date: document.getElementById('date').value,
                amount: document.getElementById('amount').value,
                paymentMode: document.getElementById('paymentMode').value,
                status: document.getElementById('status').value,
                imageUrl: `assets/images/${document.getElementById('product').value.toLowerCase()}.jpeg`
            };
            renderTable();
            customerModal.hide();
            customerForm.reset();
        };
    };

    window.deleteCustomer = function (index) {
        customers.splice(index, 1);
        renderTable();
    };

    addCustomerBtn.addEventListener('click', () => {
        customerForm.reset();
        customerModal.show();
        customerForm.onsubmit = (e) => {
            e.preventDefault();
            const newCustomer = {
                trackingId: document.getElementById('trackingId').value,
                product: document.getElementById('product').value,
                customer: document.getElementById('customer').value,
                date: document.getElementById('date').value,
                amount: document.getElementById('amount').value,
                paymentMode: document.getElementById('paymentMode').value,
                status: document.getElementById('status').value,
                imageUrl: `assets/images/${document.getElementById('product').value.toLowerCase()}.jpeg`
            };
            customers.push(newCustomer);
            renderTable();
            customerModal.hide();
        };
    });

    showEntriesSelect.addEventListener('change', () => {
        rowsPerPage = parseInt(showEntriesSelect.value);
        currentPage = 1;
        renderTable();
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredCustomers = customers.filter(customer =>
            customer.trackingId.toLowerCase().includes(query) ||
            customer.product.toLowerCase().includes(query) ||
            customer.customer.toLowerCase().includes(query) ||
            customer.date.toLowerCase().includes(query) ||
            customer.amount.toString().includes(query) ||
            customer.paymentMode.toLowerCase().includes(query) ||
            customer.status.toLowerCase().includes(query)
        );
        customerTable.innerHTML = '';
        filteredCustomers.forEach((customer, index) => {
            customerTable.innerHTML += `
                <tr>
                    <td>${customer.trackingId}</td>
                    <td><img src="${customer.imageUrl}" alt="${customer.product}" width="30"> ${customer.product}</td>
                    <td>${customer.customer}</td>
                    <td>${customer.date}</td>
                    <td>${customer.amount}</td>
                    <td>${customer.paymentMode}</td>
                    <td><span class="status-${customer.status.toLowerCase()}">${customer.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editCustomer(${index})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${index})"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage * rowsPerPage < customers.length) {
            currentPage++;
            renderTable();
        }
    });

    renderTable();
});
