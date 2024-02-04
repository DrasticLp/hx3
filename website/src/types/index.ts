import { MouseEventHandler } from "react";

interface Student {
    description: string;
    name: string;
    classroom: string;
    functions: string[];
}

export type studentMap = Map<string, Student>;

export interface CustomButtonProps {
    title: string;
    buttonType?: "button" | "submit";
    containerStyles?: string;
    handleClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface PdmSectionProps {
    data: any;
    entries: {
        entries: [
            key: string,
            value: {
                content: string;
                date: number;
                concerned: string;
            }
        ];
        starred: string[];
    };
    setShouldRerender: (shouldRerender: boolean) => void;
}

export interface LoginPageProps {
    setShouldRerender: (shouldRerender: boolean) => void;
}

export interface CardListProps {
    filteredStudents: studentMap;
    entries: {
        entries: any;
        starred: string[];
    };
    students: studentMap;
    setShouldRerender: (shouldRerender: boolean) => void;
}

export interface CardProps {
    classroom: string;
    name: string;
    id: string;
    functions: string;
    starred: string[];
    entries: any;
    students: studentMap;
    setShouldRerender: (shouldRerender: boolean) => void;
}

export interface AddEntryProps {
    opened: boolean;
    setOpened: (opened: boolean) => void;
    students: studentMap;
    setShouldRerender: (shouldRerender: boolean) => void;
}

export interface EntryListProps {
    id: string;
    entries: [string, unknown][];
    students: studentMap;
    isShowing: boolean;
    setShouldRerender: (shouldRerender: boolean) => void;
    setIsShowing: (isShowing: boolean) => void;
}

export interface EntryPaneProps {
    id: string;
    basePrivate: boolean;
    baseContent: string;
    baseConcerned: string[];
    students: studentMap;
    opened: boolean;
    setShouldRerender: (shouldRerender: boolean) => void;
    close: () => void;
    closeParent: () => void;
}

export interface PzSectionProps {
    files: any;
    setShouldRerender: (shouldRerender: boolean) => void;
}

export interface ImageSliderProps {
    files: any;
    year: string;
    event: string;
    cookies: {
        token?: any;
        user?: any;
    };
    setShouldRerender: (shouldRerender: boolean) => void;

    setEvent: (event: string) => void;
}

export interface PzUploaderProps {
    show: boolean;
    setShown: (shown: boolean) => void;
    yearList: string[];
    cookies: {
        token?: any;
        user?: any;
    };
    setShouldRerender: (shouldRerender: boolean) => void;
}
