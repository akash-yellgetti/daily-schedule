class PaperTrading {
  constructor(initialBalance = 10000) {
    this.balance = initialBalance; // Starting balance
    this.portfolio = {}; // Portfolio to track stocks and their quantities
    this.orderLog = []; // Order log to store all trades (buy/sell)
  }

  // Method to simulate a buy order
  buy(stockSymbol, quantity, price) {
    const totalCost = quantity * price;
    if (totalCost > this.balance) {
      console.log(`Not enough balance to buy ${quantity} of ${stockSymbol}`);
      return false;
    }

    // Update balance and portfolio
    this.balance -= totalCost;
    if (!this.portfolio[stockSymbol]) {
      this.portfolio[stockSymbol] = {
        quantity: 0,
        avgPrice: 0,
      };
    }

    

    // Update the portfolio with the new quantity
    this.portfolio[stockSymbol].quantity += quantity;

    // Calculate the new average price for the stock using the helper function
    this.portfolio[stockSymbol].avgPrice = this.calculateAvgPrice(stockSymbol, price, quantity);


    // Log the order
    const order = {
      type: 'BUY',
      stockSymbol,
      quantity,
      price,
      totalCost,
      date: new Date().toISOString(),
    };
    this.orderLog.push(order);

    console.log(`Bought ${quantity} of ${stockSymbol} at $${price} each. Total cost: $${totalCost}`);
    return true;
  }

  // Method to simulate a sell order without restrictions on share quantity
  sell(stockSymbol, quantity, price) {
    const totalRevenue = quantity * price;
    this.balance += totalRevenue;

    if (!this.portfolio[stockSymbol]) {
      this.portfolio[stockSymbol] = {
        quantity: 0,
        avgPrice: price,
      };
    }

    
    // Calculate the new average price for the stock using the helper function
    this.portfolio[stockSymbol].avgPrice = this.calculateAvgPrice(stockSymbol, price, quantity);

    // Update the portfolio with the new quantity
    this.portfolio[stockSymbol].quantity -= quantity;



    // Log the order
    const order = {
      type: 'SELL',
      stockSymbol,
      quantity,
      price,
      totalRevenue,
      date: new Date().toISOString(),
    };
    this.orderLog.push(order);

    console.log(`Sold ${quantity} of ${stockSymbol} at $${price} each. Total revenue: $${totalRevenue}`);
    return true;
  }

   // Helper function to calculate the average price of a stock in the portfolio
  calculateAvgPrice(stockSymbol, price, quantity) {
    const currentStock = this.portfolio[stockSymbol];
    const totalShares = Math.abs(currentStock.quantity)+Math.abs(quantity);
    const totalPrice =  (Math.abs(currentStock.quantity) * currentStock.avgPrice) + (price * quantity);

    return totalPrice / totalShares;
  }

  // Method to get the current portfolio value (excluding cash)
  portfolioValue() {
    let value = 0;
    for (const stockSymbol in this.portfolio) {
      const currentPrice = this.getStockPrice(stockSymbol); // Replace with real API or static data
      value += this.portfolio[stockSymbol].avgPrice * currentPrice;
    }
    return value;
  }

  // Method to get the current balance (cash)
  getBalance() {
    return this.balance;
  }

  // Simulate fetching the current stock price
  getStockPrice(stockSymbol) {
    // Placeholder static prices for simplicity
    const prices = {
      'AAPL': 150,
      'GOOG': 2800,
      'TSLA': 700,
    };
    return prices[stockSymbol] || 0;
  }

  // Method to display the current status (balance, portfolio, portfolio value)
  status() {
    console.log(`Balance: $${this.balance}`);
    console.log('Portfolio:', this.portfolio);
    console.log('Portfolio Value: $', this.portfolioValue());
  }

  // Method to display the order log
  displayOrderLog() {
    console.log('Order Log:');
    this.orderLog.forEach(order => {
      console.log(`${order.date} | ${order.type} | ${order.stockSymbol} | Quantity: ${order.quantity} | Price: $${order.price} | Total: $${order.totalRevenue || order.totalCost}`);
    });
  }

  // Method to display the order log
  displayPortfolio() {
    console.log('Order Log:');
    // this.portfolio.forEach(order => {
      const portfolio = this.portfolio;
      console.table(portfolio)
      // for(const i in portfolio) {
      //   const order = portfolio[i];
      //   console.log(order)
      //   // console.log(`${order.date} | ${order.type} | ${order.stockSymbol} | Quantity: ${order.quantity} | Price: $${order.price} | Total: $${order.totalRevenue || order.totalCost}`);  
      // }
      
    // });
  }
}

// Example usage
const trader = new PaperTrading(10000);

// Execute some buy and sell trades
trader.sell('AAPL', 15, 160); // Sell 15 AAPL at $160 (even though only 10 were bought)
trader.displayPortfolio();
trader.sell('AAPL', 15, 155); // Sell 15 AAPL at $160 (even though only 10 were bought)
trader.displayPortfolio();
trader.buy('AAPL', 10, 150); // Buy 10 AAPL at $150
trader.displayPortfolio();
trader.buy('AAPL', 10, 150); // Buy 10 AAPL at $150
trader.displayPortfolio();
trader.buy('AAPL', 10, 150); // Buy 10 AAPL at $150
trader.displayPortfolio();
// trader.buy('AAPL', 10, 150); // Buy 10 AAPL at $150
 

trader.displayPortfolio();
