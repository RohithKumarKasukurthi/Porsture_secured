export const getExposureData = (allocation) => {
  const total =
    allocation.Equity + allocation.Bond + allocation.Derivative;
 
  return [
    {
      name: "Equity",
      value: total ? +(allocation.Equity / total * 100).toFixed(2) : 0,
    },
    {
      name: "Bond",
      value: total ? +(allocation.Bond / total * 100).toFixed(2) : 0,
    },
    {
      name: "Derivative",
      value: total ? +(allocation.Derivative / total * 100).toFixed(2) : 0,
    },
  ];
};
 
export const evaluateBreaches = (allocation) => {
  const exposure = getExposureData(allocation);
  const breaches = [];
 
  exposure.forEach((e) => {
    if (e.name === "Equity" && e.value > 60)
      breaches.push("Equity exposure exceeds 60%");
    if (e.name === "Bond" && e.value > 70)
      breaches.push("Bond exposure exceeds 70%");
    if (e.name === "Derivative" && e.value > 30)
      breaches.push("Derivative exposure exceeds 30%");
  });
 
  return breaches;
};
 
export const calculateRiskScore = (allocation) => {
  const exposure = getExposureData(allocation);
  let score = 0;
 
  exposure.forEach((e) => {
    if (e.name === "Equity") score += e.value * 0.7;
    if (e.name === "Bond") score += e.value * 0.3;
    if (e.name === "Derivative") score += e.value * 1.2;
  });
 
  return Math.min(100, Math.round(score));
};
 
export const getRiskLevel = (score) => {
  if (score >= 75) return { label: "High", color: "error" };
  if (score >= 50) return { label: "Medium", color: "warning" };
  return { label: "Low", color: "success" };
};
 