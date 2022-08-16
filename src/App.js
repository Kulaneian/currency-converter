import { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

const myHeaders = new Headers();
myHeaders.append("apikey", "zbNiGwffcukaGagwrBWevuMFxRKpjZ6F");
const BASE_URL = 'https://api.apilayer.com/exchangerates_data/latest?';


let requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

function App() {
  const [currency, setCurrency] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [forex, setForex] = useState()
  const [amount, setAmount] = useState(1)
  const [amountFrom, setAmountFrom] = useState(true)

  let toAmount, fromAmount;
  if(amountFrom) {
    fromAmount = amount
    toAmount = amount * forex
  } else {
    toAmount = amount
    fromAmount = amount / forex
  }

  useEffect(()=> {
    fetch(BASE_URL, requestOptions)
      .then(res => res.json())
      .then(data => {
        const firstcurrency = Object.keys(data.rates)[0]
        setCurrency([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base)
        setToCurrency(firstcurrency)
        setForex(data.rates[firstcurrency])
      })
  }, [])

  useEffect(() => {
    if (fromCurrency  != null && toCurrency != null)
    fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
      .then(res => res.json)
      .then(data => setForex(data.rates[toCurrency]))
  }, [fromCurrency, toCurrency])

  function handlefromAmountchange (e) {
    setAmount(e.target.value)
    setAmountFrom(true)
  }

  function handleToAmountchange (e) {
    setAmount(e.target.value)
    setAmountFrom(false)
  }

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow 
        currency={currency}
        selectCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handlefromAmountchange}
        amount={fromAmount}
      />
      <div className='equals'>=</div>
      <CurrencyRow 
        currency={currency}
        selectCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountchange}
        amount={toAmount}
      />
    </>
  );
}

export default App;

