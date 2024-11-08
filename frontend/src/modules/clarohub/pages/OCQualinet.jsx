import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "modules/shared/components/ui/button";
import { Card, CardContent } from "modules/shared/components/ui/card";
import { Textarea } from "modules/shared/components/ui/textarea";
import {
  Loader2,
  FileIcon,
  Sparkles,
  ArrowRight,
  Copy,
  UploadCloud,
  Atom,
  Zap,
  CheckCircle2,
  Hexagon,
} from "lucide-react";
import axiosInstance from "services/axios";
import { toast } from "sonner";
import Container from "modules/shared/components/ui/container";
import appHeaderInfo from "modules/shared/utils/appHeaderInfo";

const OCQualinet = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [newData, setNewData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
    setCurrentStep(1);
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
    setIsProcessing(true);

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
      setCurrentStep(2);
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      toast.error(
        error.response?.data ||
          "Erro ao enviar o arquivo. Por favor, tente novamente.",
      );
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <Container innerClassName="sm:mt-5">
      <div className="relative mb-16 text-center">
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary/30 blur-3xl"></div>
        {/* <Atom className="mx-auto mb-6 h-20 w-20 animate-spin text-primary [animation-duration:10s]" /> */}
        <img
          src={appHeaderInfo["/ocfacil"].icon}
          alt="Net Fácil Icon"
          className="mx-auto mb-6 h-20 w-20 text-primary"
        />

        <h1 className="relative text-4xl font-bold tracking-tight text-foreground">
          OC Fácil
        </h1>
        <p className="mt-3 text-lg text-muted">
          Transforme extrações do QualiNET em Ocorrências no PowerApps
        </p>
      </div>

      <Card className="relative mx-auto max-w-5xl overflow-hidden border-primary/20 bg-background/50 shadow-2xl backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-card/15"></div>

        <CardContent className="relative p-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: 0, title: "Carregar Extração", icon: UploadCloud },
              { step: 1, title: "Processar dados", icon: Atom },
              { step: 2, title: "Resultado", icon: Sparkles },
            ].map(({ step, title, icon: Icon }) => (
              <div
                key={step}
                className={`flex flex-1 transform flex-col transition-all duration-500 ${
                  currentStep === step ? "opacity-100" : "opacity-50"
                }`}
              >
                <div className="relative flex h-full flex-col rounded-xl border-2 border-primary/40 bg-card/70 p-6 backdrop-blur-sm">
                  <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary),0.1),rgba(255,255,255,0))]"></div>

                  <div className="mb-4 flex items-center gap-2">
                    <Icon className="h-6 w-6 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">
                      {title}
                    </h2>
                  </div>

                  {step === 0 && (
                    <div
                      {...getRootProps()}
                      className={`group flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all ${
                        isDragActive
                          ? "border-primary bg-primary/10"
                          : "border-primary/40 hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      <input {...getInputProps()} />
                      {selectedFile ? (
                        <div className="text-center">
                          <FileIcon className="mx-auto mb-4 h-16 w-16 text-primary" />
                          <p className="text-sm font-medium text-foreground">
                            {selectedFile.name}
                          </p>
                          <p className="mt-2 text-xs text-muted">
                            Carregado com sucesso
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <UploadCloud className="mx-auto mb-4 h-16 w-16 text-primary transition-transform group-hover:scale-110" />
                          <p className="text-sm font-medium text-foreground">
                            Arraste aqui a planilha do QualiNet
                          </p>
                          <p className="mt-2 text-xs text-muted">
                            ou clique para selecionar
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="flex flex-1 flex-col items-center justify-center">
                      {isProcessing ? (
                        <div className="text-center">
                          <Loader2 className="mx-auto mb-4 h-16 w-16 animate-spin text-primary" />
                          <p className="text-sm font-medium text-muted">
                            Processando dados...
                          </p>
                        </div>
                      ) : (
                        <>
                          <Atom className="h-16 w-16 text-primary" />
                          <Button
                            className="relative mt-6 w-full gap-2"
                            size="lg"
                            onClick={handleFileUpload}
                            disabled={isLoading || !selectedFile}
                          >
                            <Zap className="h-5 w-5" />
                            Iniciar Processamento
                            <ArrowRight className="absolute right-4 h-5 w-5 animate-pulse" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="flex flex-1 flex-col items-center justify-center">
                      {newData ? (
                        <div className="mt-8 flex flex-col items-center gap-6 text-center text-sm">
                          <CheckCircle2 className="w-8" />
                          <span className="flex items-center gap-2 text-success">
                            <span>
                              Sucesso! Dados copiados para área de transferência
                            </span>
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() =>
                              navigator.clipboard.writeText(newData)
                            }
                          >
                            <Copy className="h-4 w-4" />
                            Copiar novamente
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-8 flex flex-col items-center text-center">
                          <Sparkles className="mb-4 h-16 w-16 text-primary" />
                          <p className="text-sm text-muted">
                            Aguardando dados processados...
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            {[0, 1, 2].map((step) => (
              <Hexagon
                key={step}
                className={`mx-1 h-4 w-4 transition-all ${
                  currentStep >= step
                    ? "fill-primary text-primary"
                    : "text-primary/20"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default OCQualinet;
