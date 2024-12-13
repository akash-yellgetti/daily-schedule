// https://www.moneycontrol.com/mccode/common/autosuggestion_solr.php?classic=true&query=cru&type=1&format=json&callback=suggest1
var app = angular.module('paperTradingApp', ['ui.bootstrap']);

// Custom autocomplete directive
app.directive('autocompleteInput', ['$http', '$timeout', function ($http, $timeout) {
    return {
        restrict: 'E',
        scope: {
            ngModel: '=',
            searchUrl: '@',
            placeholder: '@',
            clearInput: '@' // New scope variable for controlling input clearing
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
        link: function (scope, element, attrs) {
            scope.suggestions = []; // Stores the search suggestions
            scope.loading = false;   // Controls the loading spinner
            scope.searchQuery = '';  // The search query entered by the user

            // Function to fetch suggestions based on the search query
            scope.searchUsers = function () {
                if (scope.searchQuery && scope.searchQuery == 0) {
                    scope.searchQuery = '';
                    scope.suggestions = []; // Clear suggestions if query is too short
                    return;
                }

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

            // Function to select a user from the suggestions
            scope.selectUser = function (user) {
                scope.ngModel = user.name; // Set the selected user to ngModel
                scope.searchQuery = user.name; // Set the selected user to ngModel
                scope.suggestions = []; // Clear suggestions after selection
            
                if (scope.clearInput === 'true') {
                    // Clear input field if clearInput is set to 'true'
                    scope.searchQuery = ''; // Reset the search query to empty
                }
            };

            // Watch for changes in searchQuery and clear it if necessary
            scope.$watch('searchQuery', function (newValue, oldValue) {
              // console.log(newValue)
              // console.log(oldValue)
                if (!newValue && scope.clearInput === 'true') {
                  console.log('newValue', newValue)
                    // If input is cleared manually (empty), reset ngModel
                    scope.ngModel = null;
                }
            });
        }
    };
}]);

app.controller('TradingController', ['$scope', '$http' ,function($scope, $http) {
          $scope.trades = [];
          $scope.portfolio = {};
          $scope.startingBalance = 100000;
          $scope.realizedPL = 0;
          $scope.unrealizedPL = 0;
          $scope.currentBalance = $scope.startingBalance;
          $scope.newTrade = {
            StockSearchClearInput: false
          };
      
       

          $scope.addTrade = function() {
              const trade = { ...$scope.newTrade };
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