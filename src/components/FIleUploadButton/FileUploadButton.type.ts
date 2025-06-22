export interface FileUploadButtonProps {
  buttonText: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleDiscardFile: () => void;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
    status: "loading" | "success" | "error" | "default";
}