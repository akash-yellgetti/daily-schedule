angular.module('paperTradingApp', [])
      .controller('TradingController', ['$scope', function($scope) {
          $scope.trades = [];
          $scope.portfolio = {};
          $scope.startingBalance = 100000;
          $scope.realizedPL = 0;
          $scope.unrealizedPL = 0;
          $scope.currentBalance = $scope.startingBalance;
          $scope.newTrade = {};
      
          $scope.addTrade = function() {
              const trade = { ...$scope.newTrade };
              trade.totalCost = trade.quantity * trade.price;
              $scope.trades.push(trade);
              $scope.updatePortfolio(trade);
              $scope.calculateSummary();
              $scope.newTrade = {};
          };
      
          $scope.updatePortfolio = function(trade) {
              const stock = trade.stock.toUpperCase();
              if (!$scope.portfolio[stock]) {
                  $scope.portfolio[stock] = { quantity: 0, avgPrice: 0, unrealizedPL: 0 };
              }
      
              const stockData = $scope.portfolio[stock];
              if (trade.action === 'Buy') {
                  const totalValue = stockData.avgPrice * stockData.quantity + trade.price * trade.quantity;
                  stockData.quantity += trade.quantity;
                  stockData.avgPrice = totalValue / stockData.quantity;
              } else if (trade.action === 'Sell') {
                  const sellValue = trade.price * trade.quantity;
                  $scope.realizedPL += (trade.price - stockData.avgPrice) * trade.quantity;
                  stockData.quantity -= trade.quantity;
                  if (stockData.quantity <= 0) delete $scope.portfolio[stock];
              }
              $scope.calculateUnrealizedPL();
          };
      
          $scope.calculateUnrealizedPL = function() {
              $scope.unrealizedPL = 0;
              angular.forEach($scope.portfolio, function(data, stock) {
                  data.unrealizedPL = (data.avgPrice - data.avgPrice) * data.quantity; // Assume avgPrice as marketPrice for now
                  $scope.unrealizedPL += data.unrealizedPL;
              });
          };
      
          $scope.calculateSummary = function() {
              $scope.currentBalance = $scope.startingBalance + $scope.realizedPL;
          };
      }]);