export  type ButtonProps = {
    handleClick: Function,
    children: React.ReactNode,
    disabled?: boolean,
type: "send" | "download" | "clear"
}