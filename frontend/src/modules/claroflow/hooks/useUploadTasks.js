import { useState } from "react";
import axiosInstance from "services/axios";
import { toast } from "sonner";

const useUploadTasks = () => {
  const [state, setState] = useState({
    selectedFile: null,
    isUploading: false,
    uploadResult: null,
    error: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file, projectId, assignmentId) => {
    if (!projectId || !assignmentId) {
      toast.error("Selecione o projeto e a demanda antes de enviar");
      return null;
    }
    if (!file) {
      toast.error("Selecione um arquivo para enviar");
      return null;
    }

    setState((s) => ({ ...s, isUploading: true, error: null }));
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);
    formData.append("assignmentId", assignmentId);

    try {
      const res = await axiosInstance.post("/flow/tasks/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        },
      });

      setState({
        selectedFile: null,
        isUploading: false,
        uploadResult: res.data,
        error: null,
      });
      toast.success("Importação concluída com sucesso");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Falha na importação";
      setState((s) => ({ ...s, error: msg, isUploading: false }));
      toast.error(msg);
      return null;
    } finally {
      setUploadProgress(0);
    }
  };

  const resetUpload = () => {
    setState({
      selectedFile: null,
      isUploading: false,
      uploadResult: null,
      error: null,
    });
    setUploadProgress(0);
  };

  return {
    ...state,
    uploadProgress,
    uploadFile,
    resetUpload,
    setSelectedFile: (file) => setState((s) => ({ ...s, selectedFile: file })),
  };
};

export default useUploadTasks;
