import { useContext } from "react";
import { PageContext } from "../context/PageContext";

export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePage must be used within a PageContextProvider");
  }
  const { activePage, setActivePage } = context;
  return { activePage, setActivePage };
};
