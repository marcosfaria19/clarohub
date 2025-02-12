import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axiosInstance from "services/axios";
import { toast } from "sonner";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "modules/shared/components/ui/alert";
import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  XCircle,
  FileCheck,
  Check,
} from "lucide-react";
import { Card } from "modules/shared/components/ui/card";
import { Button } from "modules/shared/components/ui/button";

export default function MDUpload({ onClose }) {
  const [state, setState] = useState({
    selectedFile: null,
    isUploading: false,
    uploadResult: null,
    error: null,
  });

  const onDrop = useCallback((acceptedFiles) => {
    setState((prev) => ({
      ...prev,
      selectedFile: acceptedFiles[0],
      uploadResult: null,
      error: null,
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleUpload = async () => {
    if (!state.selectedFile) {
      toast.error("Selecione um arquivo antes de continuar");
      return;
    }

    setState((prev) => ({ ...prev, isUploading: true, error: null }));

    try {
      const formData = new FormData();
      formData.append("file", state.selectedFile);

      const response = await axiosInstance.post("/mdu/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setState((prev) => ({
        ...prev,
        uploadResult: response.data,
        isUploading: false,
      }));
      toast.success("Dados importados com sucesso!");
    } catch (error) {
      console.error("Upload error:", error);
      setState((prev) => ({
        ...prev,
        error: error.response?.data || "Erro na importação",
        isUploading: false,
      }));
      toast.error(
        "Falha na importação. Verifique o arquivo e tente novamente.",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Área principal condicional */}
      {state.uploadResult || state.error ? (
        // Mensagens de resultado
        <>
          {state.uploadResult && (
            <Alert variant="success" className="animate-fade-in">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Importação concluída!</AlertTitle>
              <AlertDescription className="mt-4 grid grid-cols-2 gap-2">
                <div className="text-foreground">
                  <span>Total de linhas:</span>{" "}
                  {state.uploadResult.originalRows}
                </div>
                <div className="text-foreground">
                  <span>Importadas:</span> {state.uploadResult.insertedRows}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {state.error && (
            <Alert variant="destructive" className="animate-fade-in">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Erro na importação</AlertTitle>
              <AlertDescription className="mt-4">
                {state.error}
              </AlertDescription>
            </Alert>
          )}
        </>
      ) : (
        // Card de upload
        <Card
          {...getRootProps()}
          className={`group flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-primary/40 hover:border-primary hover:bg-primary/5"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <UploadCloud
              className={`mx-auto h-16 w-16 text-primary transition-transform group-hover:scale-110 ${
                isDragActive
                  ? "scale-110 text-primary"
                  : "text-muted-foreground"
              }`}
            />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {state.selectedFile ? (
                  <>
                    <FileCheck className="mr-2 inline h-4 w-4" />
                    {state.selectedFile.name}
                  </>
                ) : (
                  "Arraste aqui a extração do SGD"
                )}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                ou clique para selecionar - formatos suportados: .csv (até 5MB)
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Botões condicionais */}
      <div className="flex justify-end gap-4">
        {state.uploadResult || state.error ? (
          <Button onClick={onClose}>Finalizar</Button>
        ) : (
          <>
            <Button
              onClick={handleUpload}
              disabled={!state.selectedFile || state.isUploading}
            >
              {state.isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Iniciar Importação
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
