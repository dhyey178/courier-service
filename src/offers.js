const OfferStrategies = {
    OFR001: {
        discount: 0.1,
        criteria: (weight, distance) => weight >= 70 && weight <= 200 && distance >= 0 && distance <= 200,
    },
    OFR002: {
        discount: 0.07,
        criteria: (weight, distance) => weight >= 10 && weight < 150 && distance >= 50 && distance <= 250,
    },
    OFR003: {
        discount: 0.05,
        criteria: (weight, distance) => weight >= 10 && weight <= 250 && distance >= 50 && distance <= 250,
    },
};

module.exports = OfferStrategies;