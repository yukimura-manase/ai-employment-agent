import { Fragment, ReactNode } from "react";

export const NoSSRWrapper = ({ children }: { children: ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};
