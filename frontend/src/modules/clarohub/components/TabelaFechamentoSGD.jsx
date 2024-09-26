import React, { useEffect, useState } from "react";
import axiosInstance from "services/axios";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";

const TabelaFechamentoSGD = ({ item }) => {
  const columns = [
    {
      accessorKey: "FILA",
      header: "Fila",
    },
    {
      accessorKey: "SELECAO",
      header: "Seleção",
    },
    {
      accessorKey: "MOTIVO",
      header: "Motivo",
    },
  ];

  const [sgdData, setSgdData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const sgdResponse = await axiosInstance.get(`/netfacilsgd`);
        const allSgdData = sgdResponse.data;

        const sgdIds = item?.SGD.map(Number) || [];
        const filteredSgdData = allSgdData.filter((dataItem) =>
          sgdIds.includes(dataItem.ID_SGD),
        );

        setSgdData(filteredSgdData);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (item && item.SGD) {
      fetchData();
    }
  }, [item]);

  return (
    <>
      {isLoading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : sgdData.length > 0 ? (
        <div className="custom-scrollbar my-10 max-h-[60vh] overflow-auto">
          <p className="mb-2 font-semibold">Fechamentos sugeridos no SGD:</p>
          <TabelaPadrao
            columns={columns}
            data={sgdData}
            filterInput={false}
            columnFilter={false}
            pagination={false}
          />
        </div>
      ) : null}
    </>
  );
};

export default TabelaFechamentoSGD;
