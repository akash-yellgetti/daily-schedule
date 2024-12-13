class MoneyManagement {
	accountBalance = 300000;
	riskPercentage = 2;
	rewardRatioValue = 1.5;

	constructor(entryPrice) {
		this.entryPrice = entryPrice;
		this.initialize();
	}

	initialize() {
		this.stopLossPrice = this.entryPrice * this.percentageValue(this.stopLossPercentage(this.entryPrice));
		console.log(this.stopLossPrice)
		console.log(this.percentageValue(this.stopLossPercentage(this.entryPrice)))
	}

	calculateRisk() {
		return this.accountBalance * this.percentageValue(this.riskPercentage);
	}

	calculateReward() {
		return this.calculateRisk() * this.rewardRatioValue;
	}

	calculateQty() {
		return  (this.accountBalance / this.entryPrice) < this.calculateRisk() / (this.entryPrice - this.stopLossPrice) ? (this.accountBalance / this.entryPrice) : this.calculateRisk() / (this.entryPrice - this.stopLossPrice);
	}

	percentageValue(val) {
		return val/100;
	}

	stopLossPercentage(price) {
		const ranges = [
			{
				lower: 0,	
				upper: 100,
				percentage: 5
			},
			{
				lower: 101,	
				upper: 500,
				percentage: 4
			},
			{
				lower: 501,	
				upper: 1500,
				percentage: 3
			},
			{
				lower: 1501,	
				upper: 5000,
				percentage: 2
			},
			{
				lower: 5001,	
				upper: 10000,
				percentage: 2
			},
		];

		const range = ranges.find((r) => {
			return r.lower <= price && price <= r.upper;
		})

		return range.percentage;
	}
}

const mm = new MoneyManagement(1300);

// console.log(mm.calculateRisk())
// console.log(mm.calculateReward())
// console.log(mm.calculateQty())