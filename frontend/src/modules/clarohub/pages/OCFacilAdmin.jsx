// OCFacilAdmin.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Container from "modules/shared/components/ui/container";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import axiosInstance from "services/axios";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";
import { toast } from "sonner";

const formatarData = (dataNumerica) => {
  const data = new Date((dataNumerica - 25569) * 86400 * 1000);
  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

function OCFacilAdmin() {
  const [dados, setDados] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      const response = await axiosInstance.get(`/ocqualinet`);
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do backend:", error);
    }
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setShowEditModal(true);
  };

  const handleDeleteClick = (item) => {
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      await axiosInstance.put(`/ocqualinet/${currentItem._id}`, currentItem);
      setShowEditModal(false);
      fetchDados();
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/ocqualinet/${currentItem._id}`);
      setShowDeleteModal(false);
      fetchDados();
    } catch (error) {
      console.error("Erro ao deletar dados:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "CI_NOME",
        header: ({ column }) => {
          return (
            <Button
              className="flex"
              variant="link"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              CIDADE
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: "UF",
        header: ({ column }) => {
          return (
            <Button
              className="flex"
              variant="link"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              UF
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        header: "CONTRATO",
        accessorKey: "NUM_CONTRATO",
      },
      {
        accessorKey: "DT_CADASTRO",
        cell: (info) => formatarData(info.getValue()),
        header: ({ column }) => {
          return (
            <Button
              className="flex"
              variant="link"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              CADASTRO
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        header: "ENDEREÇO",
        accessorKey: "END_COMPLETO",
      },
      {
        header: "NODE",
        accessorKey: "COD_NODE",
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const data = row.original;

          const copyDataToClipboard = () => {
            const values = Object.keys(data)
              .map((key) => `${key}: ${data[key]}`)
              .join("\n");
            navigator.clipboard.writeText(values);
            toast.success("Item copiado com sucesso", { duration: 2000 });
          };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="h-8 w-8 p-0">
                  <span className="sr-only">Menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={copyDataToClipboard}>
                  Copiar dados
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Editar</DropdownMenuItem>
                <DropdownMenuItem>Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  return (
    <Container>
      <div className="mt-4">
        <h3 className="text-3xl">OC Fácil Admin</h3>
        <TabelaPadrao columns={columns} data={dados} />
      </div>

      {/* Modal de Edição */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Cadastro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentItem && (
            <Form>
              <Form.Group controlId="formCINome">
                <Form.Label>CI_NOME</Form.Label>
                <Form.Control
                  type="text"
                  name="CI_NOME"
                  value={currentItem.CI_NOME}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formNumContrato">
                <Form.Label>NUM_CONTRATO</Form.Label>
                <Form.Control
                  type="text"
                  name="NUM_CONTRATO"
                  value={currentItem.NUM_CONTRATO}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formDtCadastro">
                <Form.Label>DT_CADASTRO</Form.Label>
                <Form.Control
                  type="text"
                  name="DT_CADASTRO"
                  value={currentItem.DT_CADASTRO}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formEndCompleto">
                <Form.Label>END_COMPLETO</Form.Label>
                <Form.Control
                  type="text"
                  name="END_COMPLETO"
                  value={currentItem.END_COMPLETO}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formCodNode">
                <Form.Label>COD_NODE</Form.Label>
                <Form.Control
                  type="text"
                  name="COD_NODE"
                  value={currentItem.COD_NODE}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formUf">
                <Form.Label>UF</Form.Label>
                <Form.Control
                  type="text"
                  name="UF"
                  value={currentItem.UF}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir este cadastro?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default OCFacilAdmin;
