import type { defaultProps } from "../../shared/defaultProps"

export type HeaderButtonProps = defaultProps & {
    linkPath: string,
    iconPath: string,
    isActive: boolean,
}