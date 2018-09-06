export function arrDelItem (arr, diffItem) {
  return arr.filter(item => diffItem !== item)
}

export const arrDelArrItem = (arr, diffArr) => {
  return arr.filter(item => !~diffArr.indexOf(item))
}
