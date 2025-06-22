import type { defaultProps } from "../../shared/defaultProps"
export type StatsModalProps = defaultProps &{
  isOpen: boolean;
  onClose: () => void;
}