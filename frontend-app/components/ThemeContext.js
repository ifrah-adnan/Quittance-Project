import React, { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeContext.Consumer>
        {() => <div>{children}</div>}
      </ThemeContext.Consumer>
    </ThemeContext.Provider>
  );
};
