const calculateDynamicPrice = (durationMinutes) => {
  let amount = 0;

  if (durationMinutes <= 30) {
    amount = 10;
  } else if (durationMinutes <= 60) {
    amount = 20;
  } else {
    const extraHours = Math.ceil((durationMinutes - 60) / 60);
    amount = 20 + (extraHours * 20);
  }

  return amount;
};

module.exports = calculateDynamicPrice;
