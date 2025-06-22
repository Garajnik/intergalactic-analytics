import type { MouseEventHandler } from "react"
import type { defaultProps } from "../../shared/defaultProps"

export type HeaderButtonProps = defaultProps & {
    onClick: MouseEventHandler<HTMLDivElement>,
    iconPath: string,
    isActive: boolean,
}