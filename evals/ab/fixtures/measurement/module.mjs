export const summarize = values => {
  const data = values.filter(Boolean);
  const sum = data.reduce((total, value) => total + value, 0);
  return { count: data.length, sum, mean: sum / data.length };
};
