import type { MouseEventHandler } from "react"

export  type ButtonProps = {
    handleClick: MouseEventHandler<HTMLButtonElement>,
    children: React.ReactNode,
    disabled?: boolean,
type: "send" | "download" | "clear"
}