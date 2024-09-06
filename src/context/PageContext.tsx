import { createContext, ReactNode, useState } from "react";

type PageContextType = {
  activePage: string;
  setActivePage: (page: string) => void;
};

type PageContextProviderProps = {
  children: ReactNode;
};

export const PageContext = createContext<PageContextType | null>(null);
export const PageContextProvider: React.FC<PageContextProviderProps> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [activePage, setActivePage] = useState<string>("Dashboard");
  return (
    <PageContext.Provider value={{ activePage, setActivePage }}>
      {children}
    </PageContext.Provider>
  );
};
