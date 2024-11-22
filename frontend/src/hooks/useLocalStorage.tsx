import { useState } from "react";

export function useLocalStorage<T>(keyName: string, defaultValue: T) {
  const [storedValue, setStoredValue] = useState(() => {
    const value = window.localStorage.getItem(keyName);

    if (value) {
      return JSON.parse(value);
    }

    window.localStorage.setItem(keyName, JSON.stringify(defaultValue));

    return defaultValue;
  });

  const setValue = (newValue: T) => {
    window.localStorage.setItem(keyName, JSON.stringify(newValue));
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
}

// export const useLocalStorage = (keyName: string, defaultValue) => {
//   const [storedValue, setStoredValue] = useState(() => {
//     const value = window.localStorage.getItem(keyName);

//     if (value) {
//       return JSON.parse(value);
//     }

//     window.localStorage.setItem(keyName, JSON.stringify(defaultValue));

//     return defaultValue;
//   });

//   const setValue = (newValue) => {
//     window.localStorage.setItem(keyName, JSON.stringify(newValue));
//     setStoredValue(newValue);
//   };

//   return [storedValue, setValue];
// };
