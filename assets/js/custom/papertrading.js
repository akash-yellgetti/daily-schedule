// https://www.moneycontrol.com/mccode/common/autosuggestion_solr.php?classic=true&query=cru&type=1&format=json&callback=suggest1
var app = angular.module('paperTradingApp', ['ui.bootstrap']);

 

app.directive('autocompleteInput', ['$http', function ($http) {
    return {
        restrict: 'E',
        scope: {
            ngModel: '=',
            searchUrl: '@',
            placeholder: '@',
            clearInput: '@',
            onSelect: '&' // Expose a callback function to the parent controller
        },
        template: `
          <input type="text" 
                 class="form-control" 
                 ng-model="searchQuery" 
                 ng-keyup="searchUsers()" 
                 placeholder="{{placeholder}}" />
          <ul class="list-group" ng-show="suggestions.length > 0 && searchQuery.length > 1">
              <li class="list-group-item" 
                  ng-repeat="user in suggestions" 
                  ng-click="selectUser(user)">
                  {{ user.name }}
              </li>
          </ul>
          <div ng-show="loading">
              <i class="glyphicon glyphicon-refresh spinning"></i> Loading...
          </div>`,
        link: function (scope) {
            scope.suggestions = []; // Stores the search suggestions
            scope.loading = false;   // Controls the loading spinner
            scope.searchQuery = '';  // The search query entered by the user

            // Function to fetch suggestions based on the search query
            scope.searchUsers = function () {
                if (!scope.searchQuery || scope.searchQuery.length < 3) {
                    scope.suggestions = []; // Clear suggestions if query is too short
                    return;
                }

                scope.loading = true; // Show loading indicator
                const url = `${scope.searchUrl}${scope.searchQuery}`;

                // Fetch data from the API
                $http.get(url)
                    .then(function (response) {
                        scope.suggestions = response.data; // Populate suggestions
                        scope.loading = false; // Hide loading spinner
                    })
                    .catch(function (error) {
                        console.error('Error fetching data:', error);
                        scope.loading = false; // Hide loading spinner on error
                    });
            };

            // Function to handle selection
            scope.selectUser = function (user) {
                scope.ngModel = user.name; // Update the model
                scope.searchQuery = user.name; // Update the input field
                scope.suggestions = []; // Clear suggestions

                if (scope.clearInput === 'true') {
                    scope.searchQuery = ''; // Clear input if clearInput is true
                }

                // Trigger the callback function passed from the parent scope
                if (scope.onSelect) {
                    scope.onSelect({ selected: user });
                }
            };
        }
    };
}]);


 
app.controller('TradingController', ['$scope', '$http', function ($scope, $http) {
  $scope.trades = [];
  $scope.portfolio = {};
  $scope.stockData = {
    pricecurrent: 0,
    "fiveDayAvg": 0,
  };
  $scope.startingBalance = 100000;
  $scope.realizedPL = 0;
  $scope.unrealizedPL = 0;
  $scope.currentBalance = $scope.startingBalance;
  $scope.newTrade = {
    price: 0,
    stock: '',
    stockSearchClearInput: false
  };

 // List of suggestions
   // Function to handle selection
    $scope.onStockSelected = function (selectedStock) {
        console.log('Selected Stock:', selectedStock);

        // Make an API call to fetch details for the selected stock
        const apiUrl = `https://priceapi.moneycontrol.com/pricefeed/nse/equitycash/`+selectedStock.sc_id;
        $http.get(apiUrl)
            .then(function (response) {
              const data = response.data.data;
              $scope.stockData = data;
              $scope.stockData.fiveDayAvg = data['5DayAvg']
              $scope.newTrade.price = data.pricecurrent;
              $scope.newTrade.stock = data.NSEID;
              // $scope.newTrade.price = data.pricecurrent;
              console.log($scope.stockData)
              // pricecurrent
                // Store the fetched stock details
                // $scope.selectedStockDetails = ;
                // console.log('Stock Details:', $scope.selectedStockDetails);
            })
            .catch(function (error) {
                console.error('Error fetching stock details:', error);
            });
    };


  $scope.addTrade = function (act) {

    const trade = {
      ...$scope.newTrade
    };
    trade.action = act;
    if (!trade.stock || !trade.action || !trade.quantity || !trade.price) {
      alert('Please enter all fields');
      return;
    }
    const d = new Date();
    trade.datetime = d.toLocaleString();
    trade.totalCost = trade.quantity * trade.price;
    $scope.trades.push(trade);
    $scope.updatePortfolio(trade);
    $scope.calculateSummary();
    $scope.newTrade.stockSearchClearInput = true;
    $scope.newTrade.stock = "";
    $scope.newTrade = {
      stockSearchClearInput: false
    };
  };

  $scope.updatePortfolio = function (trade) {
    const stock = trade.stock.toUpperCase();

    // Initialize portfolio if stock doesn't exist (only for Buy action)
    if (!$scope.portfolio[stock]) {
      if (trade.action === 'Buy') {
        // If it's a Buy action, initialize stock in portfolio
        $scope.portfolio[stock] = {
          quantity: 0,
          avgPrice: 0,
          unrealizedPL: 0,
          realizedPL: 0
        };
      } else if (trade.action === 'Sell') {
        // If it's a Sell action and stock doesn't exist, add with negative quantity
        $scope.portfolio[stock] = $scope.portfolio[stock] ? $scope.portfolio[stock] : {
          quantity: -trade.quantity,
          avgPrice: trade.price,
          unrealizedPL: 0,
          realizedPL: 0
        };
      }
    }

    const stockData = $scope.portfolio[stock];

    if (trade.action === 'Buy') {
      // If it's a Buy action, update portfolio
      const totalValue = stockData.avgPrice * stockData.quantity + trade.price * trade.quantity;
      stockData.quantity += trade.quantity;
      stockData.avgPrice = totalValue / stockData.quantity;

    } else if (trade.action === 'Sell') {
      if (stockData.quantity >= 0) {
        // Calculate the realized profit/loss for this sell action
        const realizedPL = (trade.price - stockData.avgPrice) * trade.quantity;
        $scope.realizedPL += realizedPL; // Update the total realized profit/loss

        // Deduct the sold quantity from the portfolio
        stockData.quantity -= trade.quantity;

        // If no shares are left, remove from portfolio
        if (stockData.quantity <= 0) {
          delete $scope.portfolio[stock];
        }
      } else {
        // Handling for negative quantity in case of sell without owning stock
        // stockData.quantity -= trade.quantity;
        // Update the realized profit for selling without owning
        const realizedPL = (trade.price - stockData.avgPrice) * trade.quantity;
        $scope.realizedPL += realizedPL; // Update the total realized profit/loss
      }
    }

    if (stockData.quantity === 0) {
      delete $scope.portfolio[stock];
    }

    // Update Unrealized P/L
    $scope.calculateUnrealizedPL();
  };


  $scope.calculateUnrealizedPL = function () {
    $scope.unrealizedPL = 0;
    angular.forEach($scope.portfolio, function (data, stock) {
      data.unrealizedPL = (data.avgPrice - data.avgPrice) * data.quantity; // Assume avgPrice as marketPrice for now
      $scope.unrealizedPL += data.unrealizedPL;
    });
  };

  $scope.calculateSummary = function () {
    $scope.currentBalance = $scope.startingBalance + $scope.realizedPL;
  };
}]);