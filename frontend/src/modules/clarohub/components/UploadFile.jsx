import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "modules/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "modules/shared/components/ui/card";
import { Textarea } from "modules/shared/components/ui/textarea";
import { CheckCheckIcon, Loader2, UploadIcon, FileIcon } from "lucide-react";
import axiosInstance from "services/axios";
import { toast } from "sonner";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [newData, setNewData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
  });

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Nenhum arquivo selecionado.");
      return;
    }

    setIsLoading(true);
    setNewData("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axiosInstance.post(`/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const textoResposta = response.data.join("\n");
      setNewData(textoResposta);
      await navigator.clipboard.writeText(textoResposta);
      toast.success("Texto copiado para a área de transferência com sucesso.");
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      toast.error(
        error.response?.data ||
          "Erro ao enviar o arquivo. Por favor, tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <Card className="mx-auto w-full border border-secondary">
      <CardHeader>
        <CardTitle>Envio de Arquivo</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-md border-2 border-dashed p-6 text-center transition-colors ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-popover-foreground/30"
          }`}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <div className="flex flex-col items-center">
              <FileIcon className="mb-2 h-12 w-12 text-primary" />
              <p className="text-sm text-muted-foreground">
                Arquivo selecionado: {selectedFile.name}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Clique ou arraste um novo arquivo para substituir
              </p>
            </div>
          ) : isDragActive ? (
            <p>Solte o arquivo aqui...</p>
          ) : (
            <p>
              Arraste e solte uma extração do QualiNET aqui, ou clique para
              selecionar o arquivo
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button
            className="w-32"
            onClick={handleFileUpload}
            disabled={isLoading || !selectedFile}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <UploadIcon className="mr-2 h-4 w-4" />
                Enviar
              </>
            )}
          </Button>
        </div>

        {newData && (
          <div className="mt-4">
            <h4 className="mb-2 font-medium">Novos Dados:</h4>
            <Textarea
              value={newData}
              readOnly
              rows={5}
              className="w-full"
              aria-label="Dados processados"
            />
            <p className="mt-4 text-sm text-muted-foreground">
              <CheckCheckIcon className="mr-1 inline-block h-4 w-4 text-green-600" />
              Dados copiados
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadFile;
