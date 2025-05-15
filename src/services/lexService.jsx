export const sendMessageToLex = async (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`(Simulated Lex response): You said man "${message}"`);
    }, 1000);
  });
};
