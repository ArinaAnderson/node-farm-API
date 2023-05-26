const replaceTemplate = (template, product) => {
  const dataKeys = Object.keys(product);
  const output = dataKeys.reduce((acc, it) => {
    const placeholder = `{%${it.toUpperCase()}%}`;
    const newAcc = acc.replaceAll(placeholder, product[it]);
    
    return newAcc;
  }, template);
  if (!product.organic) {
    const res = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return res;
  }
  return output;
};

export default replaceTemplate;
