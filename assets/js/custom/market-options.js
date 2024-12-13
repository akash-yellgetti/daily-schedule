const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY',
  headers: { 
    'accept': '*/*', 
    'accept-language': 'en-US,en;q=0.9', 
    'cache-control': 'no-cache', 
    'cookie': '_ga=GA1.1.292366994.1732727662; AKA_A2=A; defaultLang=en; ak_bmsc=E5FEB9AB8F581E477F5F293C4E591DA3~000000000000000000000000000000~YAAQbvhWuPxn5KqTAQAAP/CnvhpNYhoeFjhMqngHI8nw114F1bEifyKxkggioMv2BSOiRgPjFguWxk7EUucimiUH34FF1SLbA0qyshkKsXd4ctcKor4rZo+rjYksOs+Rmo+1oqaThkDMG4nJ40W5xdhFA2uYBqjterX18K0cOJuBA7lMOwDUNJv1J9D3bhoyYkTZNjfSGtp+q1CReW/mxPXtLigKKoRUXN4r6ErCAK6Gzch37NuoN4jOBOFxee6PM4IDYA+g43vCOh0xGCiM9sDhwBaKp0Xcw0KqMS/UqN2Hk6WaUQHzWU6Q3Kb0LHno9HaT2vVI34KOmc69NlDEEiidXGCzfepb0eKZvx3CNNjZjRMtbBUffvFeZnhWP/57YXtn28vcW3I3UxyVKCk/e7gZ63HPkY+VuoxCkX0cYWAOeSCRWrlfu8xRGNyGv8eWsMsdnCt3njWWTMfzclQ=; nsit=WceiEQTqmhveyd6OCaCTp1Na; nseappid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkubnNlIiwiYXVkIjoiYXBpLm5zZSIsImlhdCI6MTczNDA3MDk1NiwiZXhwIjoxNzM0MDc4MTU2fQ.4ptU0oFgNtoaq1sayknLhEruzg30eOw5Gl-S9ctlcqY; bm_sz=88C96C0F6B19420F344186DA35090D93~YAAQbvhWuFGE5KqTAQAA+PuuvhrWmiLuv970Lo0xVaxt8s5eOXkZNxpS6Rms7Ymdm7k4euWoB8dGmjXXBMNxoJwQoO73ER/Qgb/rQzSEnnDpB/pfcIujYXiVkilE1FizINS45+ekakTrjxX6b5F+/HiX2SzBED70bdn7GoYbCi1uDnXNTe5WZi9lfzuwtaAnXWeGw4+26OQbvMO0tgHIoCYrAODohLJ+cvSOdoa43SK0xNiYr2crny3LVrJdLj3leIgZZzsMB+WMiaQlay9Z3iafAPqJ+VP/B88ruJ79IN0RheVWUgpnhRuaow29zLvG4BgNxQisx5J/JBCkKaM9ocyJ8NwrtQRUPl1aGsqhKE7tKCZc3NbfAB652EHCHggvUL05jxvhF8ENzxVVm65HTyztCPQY+4ZaXpE=~4338245~3753028; RT="z=1&dm=nseindia.com&si=764eef83-fadd-4b9b-926a-ed3fe321cd1c&ss=m4md2j5g&sl=0&se=8c&tt=0&bcn=%2F%2F684d0d4a.akstat.io%2F"; _abck=D36BDDACBFDB5C2BAF4AAB8688BD853C~0~YAAQbvhWuFaE5KqTAQAAbv6uvg3rLApxzGs8qZub1YusoT3lgYJ7K8dGtqumxxaB1LnKwZHXP6nnttvjtDj+bYWvNBbN0nIkhbdp1tjFhFM9zp35j0ZntEQlh1li/Qfd/1mdbY/R7wmH/Mul5xkAIeCRrSa7E4wVGuD+E37lx4wFGEVffuqbho1YMio4M8VZrOSoeVsEoVzq/Yk1FptaNFnppNF3bDlouPDGJuWASyQ+aaerm2SwYyN+CN7clLwNdFsqBRAegdAWow1AivCV+jTk/UvVqbB8vVaMtPyyeHJld9/6s8VJHM+gq/JLN9jSNYdiOcygvcJI1ejTeyILbcTSIdDnrHNIVJN+G0DQY3lOxEFEuqpHEBZWrwQ8K8TperfYoWzRn/xa/mlDcLBZH+XUcUo4aePTkCj1i6KQyone+iisxW9K2DMR8u+cWJA4jmn6bJMPJxykP1KLfNgHH+2aapXxp/mGKIC6VOIqE+bUpQ==~-1~-1~-1; _ga_87M7PJ3R97=GS1.1.1734070496.4.1.1734070959.50.0.0; _ga_WM2NSQKJEK=GS1.1.1734070496.4.1.1734070959.0.0.0; bm_sv=B25981510A166F34BCA4C9DDBEE82F6C~YAAQbvhWuFqE5KqTAQAAIACvvhrJOC9R9cg7rS4Egt0AxC1ngfrWFu93/KCfv4yuvaQp4pieHjoZ9dYyvlt5PPZe9mSzDy8ecY1BaUnkB15khIpK89GkmNEA0hWupWzYhkq3YMkCxp2jEuLPKRJwquqzI6OJqfQOpQ7FWjBawc4ackpEDLBtOiQ2Dj1Lw0QHgPpjiAgI+6Mvpne+e9rpKeGmZ7oxYZp1QxAC6vm3DVq+9QIys7R9ciEiZKKMV+Xa+ZHR~1; _abck=D36BDDACBFDB5C2BAF4AAB8688BD853C~-1~YAAQH/hWuJZ5lLGTAQAAW4O2vg3Yu33Bv0NYrhzYgXDCuq1YCI58omyfJcpcqi5AxLL5S2GFHvr2XayMmhjub23rJiq9rPm3+uDHXVCEt755l66kGXusKm7T5PZibFLIsQ5FwghxrIu3S3WV9en/SpjortBF7ZXyVVzodZ2mnu0N5nM+r7wuZUY0nv+29JP6gXa7GUl0ZYgNvPFXJlLj9bH7ir0/Ma9jKmFAK3mNn5onLiohz+nKGBe155EyZQ/C2edONn2cj0dj/lt+mvkTTw6ZC+BRxQst73xZ21gW8F3kZ1Tjuf75HzeIglMN9AdqxaqB/InusQ4MOtUJIy5YneAO5xZyn6qn8V0U/yOxzw55MqLO2VEEYWIMyyqjQ6O2+1illcHxZmUFEMrHKwotHwu3H0LpeoF/2GEoY720IJ3auiFA69EintfrWCHvSOzPeWpZXXtML4rlSs0bKIqUAWktMfXVIuT5pWwjZtXmFed6Sg==~0~-1~-1; bm_sv=B25981510A166F34BCA4C9DDBEE82F6C~YAAQH/hWuJd5lLGTAQAAW4O2vhonIglwOfPyhPMKZLHk3KQGpZRzbeilwseDkz0cEcTTdftrUUSDEaQi0lR1052T7il+tYEEasdmTS+4erzcl+IJFzAvgmCakGdXNWNfYUJ6VsitJPrOXN5mC/v54i3WCzU89QUhAUk1Vk1qB3tUmvE1rAlTLJyGEMITEFYdCDhBaafH5swBH0tovg02B3TnizVxWLSMrjCaswW3hCxbB9pzXK43AB7NSFeGsp41pyUw~1', 
    'pragma': 'no-cache', 
    'priority': 'u=1, i', 
    'referer': 'https://www.nseindia.com/option-chain', 
    'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-site': 'same-origin', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  }
};

axios.request(config)
.then((response) => {
  console.log(response.data.records.underlyingValue);
  console.log(JSON.stringify(response.data.filtered.data));
})
.catch((error) => {
  console.log(error);
});
