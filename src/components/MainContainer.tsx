import type { ReactNode } from "react";

type MainContainerProps = {
    children: ReactNode;
};

export function MainContainer({ children }: MainContainerProps) {
    return <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 lg:px-8">{children}</main>;
}
