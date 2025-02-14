export const parseCookies = () => {
  return document.cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key.trim()] = value;
    return acc;
  }, {} as Record<string, string>);
};
