export const converToQueryString = (obj: Record<string, any>): string => {
    return Object.entries(obj).reduce((result, entry, index) => { return `${result}${index === 0 ? '?' : '&'}${entry[0]}=${encodeURIComponent(entry[1])}`}, '');
}