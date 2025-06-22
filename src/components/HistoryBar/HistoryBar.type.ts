import type { MouseEventHandler } from "react";

export type HistoryBarProps = {
    fileName: string,
    date: string,
    isProcessed: boolean,
    deleteFunc: MouseEventHandler<HTMLButtonElement>, 
    openModalFunc: MouseEventHandler<HTMLDivElement>,
}