import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
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
} from "lucide-react";
import { Card } from "modules/shared/components/ui/card";
import { Button } from "modules/shared/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "modules/shared/components/ui/select";
import { Progress } from "modules/shared/components/ui/progress";
import useProjects from "modules/claroflow/hooks/useProjects";
import useUpload from "modules/claroflow/hooks/useUploadTasks";

export default function TasksUpload({ onClose }) {
  const {
    projects,
    fetchAssignments,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();
  const [assignments, setAssignments] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const {
    selectedFile,
    isUploading,
    uploadResult,
    error,
    uploadProgress,
    uploadFile,
    resetUpload,
    setSelectedFile,
  } = useUpload();

  // Quando projeto muda, carregar e filtrar assignments
  useEffect(() => {
    const loadAssignments = async () => {
      if (!selectedProject) {
        setAssignments([]);
        setSelectedAssignment(null);
        return;
      }
      const allAssignments = await fetchAssignments(selectedProject);

      // Filtrar assignments que não são usados como transição em nenhum outro (leaf nodes)
      // Esses serão os assignments que podem receber tarefas por importação
      const filteredAssignments = allAssignments.filter((assignment) => {
        // Verificar se este assignment._id não aparece em nenhum transitions de outros assignments
        return !allAssignments.some((a) =>
          a.transitions?.includes(assignment._id),
        );
      });

      setAssignments(filteredAssignments);
    };
    loadAssignments();
  }, [selectedProject, fetchAssignments]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    },
    [setSelectedFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    disabled: !selectedProject || !selectedAssignment,
  });

  const handleUpload = async () => {
    await uploadFile(selectedFile, selectedProject, selectedAssignment);
  };

  const resetForm = () => {
    resetUpload();
    setSelectedAssignment(null);
  };

  const isUploadDisabled =
    !selectedProject || !selectedAssignment || !selectedFile;

  const isSelectFileDisabled = !selectedProject || !selectedAssignment;

  return (
    <div className="space-y-6 p-4">
      {/* Project and Assignment Selection */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium leading-none text-foreground">
            Projeto
          </label>
          <Select
            value={selectedProject}
            onValueChange={(value) => {
              setSelectedProject(value);
              setSelectedAssignment(null);
            }}
            disabled={projectsLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um projeto">
                {projects.find((p) => p._id === selectedProject)?.name ||
                  "Selecione um projeto"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium leading-none text-foreground">
            Demanda
          </label>
          <Select
            value={selectedAssignment}
            onValueChange={(value) => {
              setSelectedAssignment(value);
            }}
            disabled={!assignments.length || !selectedProject}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  !selectedProject
                    ? "Selecione um projeto primeiro"
                    : !assignments.length
                      ? "Nenhuma demanda disponível"
                      : "Selecione uma demanda"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {assignments.length > 0 ? (
                assignments.map((a) => (
                  <SelectItem key={a._id} value={a._id}>
                    {a.name}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1 text-sm text-muted-foreground">
                  Nenhuma demanda disponível para importação
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* File Upload Area */}
      {uploadResult || error ? (
        <div className="space-y-4">
          {uploadResult && (
            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle className="text-foreground">
                Importação concluída!
              </AlertTitle>
              <AlertDescription className="mt-2 space-y-1 text-foreground">
                <div>Total de linhas: {uploadResult.total}</div>
                <div>Inseridas: {uploadResult.inserted}</div>
                <div>Duplicadas: {uploadResult.duplicates}</div>
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle className="text-foreground">
                Erro na importação
              </AlertTitle>
              <AlertDescription className="mt-2 text-foreground">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Card
            {...getRootProps()}
            className={`cursor-pointer border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "hover:border-primary/50"
            } ${isSelectFileDisabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-2">
              {selectedFile ? (
                <>
                  <FileCheck className="h-8 w-8 text-primary" />
                  <p className="font-medium text-foreground">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Clique para trocar o arquivo ou arraste um novo
                  </p>
                </>
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 text-muted-foreground" />
                  <p className="font-medium text-foreground">
                    Arraste e solte seu arquivo CSV aqui
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ou clique para selecionar (máx. 5MB)
                  </p>
                  {isUploadDisabled && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {!selectedProject
                        ? "Selecione um projeto primeiro"
                        : !selectedAssignment
                          ? "Selecione uma demanda válida primeiro"
                          : "Selecione um arquivo"}
                    </p>
                  )}
                </>
              )}
            </div>
          </Card>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-foreground">
                <span>Enviando...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        {uploadResult || error ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              Fechar
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Importar outro
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploadDisabled || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Importar
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
