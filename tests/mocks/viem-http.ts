export const http = (_url?: string) => {
  return () => { 
    throw new Error("HTTP request failed"); 
  };
};

