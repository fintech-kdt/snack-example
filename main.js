async function loadSnackData() {
    const response = await axios.get('./data.json');
    const data = response.data;
    localStorage.setItem('snackData', JSON.stringify(data));
}

function renderFormData() {
    const snackSelect = document.querySelector('#snack-select');
    const data = JSON.parse(localStorage.getItem('snackData'));
    data.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.name;
        option.text = item.name;
        snackSelect.appendChild(option);
    });
    const snackData = document.querySelector('#snack-data');
    data.forEach((item) => {
        const snack = document.createElement('div');
        snack.className = 'snack';
        snack.innerHTML = `
            <h5>${item.name}</h5>
            <img style="width: 160px" class="rounded" src="./image/${item.image}" />
            <p>가격: ${item.price}</p>
        `;
        snackData.appendChild(snack);
    });
}

function renderCardData() {
    const cardList = JSON.parse(localStorage.getItem('cardList'));
    const orders = document.querySelector('#orders');
    if (!cardList) {
        orders.innerHTML = `
        <div class="card">
            <div class="card-body">
                장바구니가 비어있습니다.
            </div>
        </div>`;
        return;
    }
    orders.innerHTML = '';
    const won = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    });
    cardList.forEach((item) => {
        const order = document.createElement('div');
        order.className = 'card';
        order.innerHTML = `
            <div class="card-body">
                <h4 class="card-title mb-3">${item.name}</h4>
                <p class="card-text">가격: ${won.format(item.price)}</p>
                <p class="card-text">수량: ${item.quantity}</p>
                <p class="card-text">합계: ${won.format(item.total)}</p>
                <img style="width: 160px" class="rounded" src="./image/${item.image}" />
            </div>
        `;
        orders.appendChild(order);
    });
}

function addCard(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const snackName = formData.get('snack');
    const snackQuantity = formData.get('quantity');
    const snackData = JSON.parse(localStorage.getItem('snackData'));
    const snack = snackData.find((item) => item.name === snackName);
    const cardList = JSON.parse(localStorage.getItem('cardList') || '[]');
    cardList.push({
        name: snack.name,
        price: snack.price,
        quantity: snackQuantity,
        total: snack.price * snackQuantity,
        image: snack.image,
    });
    localStorage.setItem('cardList', JSON.stringify(cardList));
    event.target.reset();
    event.target.querySelector('[type="button"]').click();
    renderCardData();
}


loadSnackData()
    .then(renderFormData)
    .then(renderCardData);

document.querySelector('#snackForm').addEventListener('submit', addCard);
document.querySelector('#reset').addEventListener('click', () => {
    localStorage.removeItem('cardList');
    renderCardData();
});