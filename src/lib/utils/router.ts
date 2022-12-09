export const getFirstQueryParam = (param: string | string[] | undefined) => {
  if (typeof param === "string") {
    return param;
  }
  if (Array.isArray(param)) {
    return param[0];
  }
  return "";
};
