const API_KEY = '07f73cec1664627fd1ee5bf319b08c12';

document.addEventListener("DOMContentLoaded", () => {
    obtenerDivisas();
    document.getElementById('toggleBtn').addEventListener('click', alternarDivisas);
});

function obtenerDivisas() {
    axios.get(`https://open.er-api.com/v6/latest?apikey=${API_KEY}`)
        .then(response => {
            const data = response.data;
            const currencies = Object.keys(data.rates);
            const fromCurrencySelector = document.getElementById("fromCurrency");
            const toCurrencySelector = document.getElementById("toCurrency");
            currencies.forEach(currency => {
                const optionFrom = document.createElement("option");
                optionFrom.value = currency;
                optionFrom.text = currency;

                const optionTo = document.createElement("option");
                optionTo.value = currency;
                optionTo.text = currency;

                fromCurrencySelector.appendChild(optionFrom);
                toCurrencySelector.appendChild(optionTo);
            });
        })
        .catch(error => {
            console.error('Error al cargar las divisas:', error);
            mostrarError('Hubo un problema al cargar las divisas. Por favor, intenta de nuevo más tarde.');
        });
}

function alternarDivisas() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    document.getElementById('fromCurrency').value = toCurrency;
    document.getElementById('toCurrency').value = fromCurrency;
}

document.getElementById("convertirBtn").addEventListener("click", function () {
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;
    const monto = parseFloat(document.getElementById("monto").value);

    if (fromCurrency && toCurrency && !isNaN(monto)) {
        convertirMoneda(fromCurrency, toCurrency, monto);
    } else {
        mostrarError("Por favor, complete todos los campos con valores válidos.");
    }
});

function convertirMoneda(from, to, monto) {
    axios.get(`https://api.exchangeratesapi.io/latest?base=${from}&symbols=${to}&access_key=${API_KEY}`)
        .then(response => {
            const data = response.data;
            if (data.error) {
                throw new Error(JSON.stringify(data.error));
            }
            const tasaCambio = data.rates[to];
            if (tasaCambio) {
                const resultado = calcularConversion(monto, tasaCambio);
                mostrarResultado(resultado, to);
            } else {
                throw new Error('No se encontró la tasa de cambio para la conversión.');
            }
        })
        .catch(error => {
            console.error('Error al realizar la conversión:', error);
            mostrarError('Hubo un problema al realizar la conversión. Por favor, intenta de nuevo más tarde.');
        });
}

function calcularConversion(monto, tasa) {
    return monto * tasa;
}

function mostrarResultado(resultado, to) {
    const resultadoElement = document.getElementById("resultado");
    resultadoElement.textContent = `El resultado es: ${resultado.toFixed(2)} ${to}`;
}

function mostrarError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
    });
}
