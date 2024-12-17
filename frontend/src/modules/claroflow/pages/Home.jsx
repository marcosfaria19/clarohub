import React from "react";
import { Dialog, DialogTrigger } from "modules/shared/components/ui/dialog";
import { useSubjectsAndCards } from "modules/clarospark/hooks/useSubjectsAndCards";
import SparkBoard from "modules/clarospark/components/board/SparkBoard";
import ErrorDisplay from "modules/clarospark/components/ErrorDisplay";
import LoadingSpinner from "modules/clarospark/components/LoadingSpinner";
import Container from "modules/shared/components/ui/container";

export default function Claroflow({ userName, userId }) {
  const { isLoading, error } = useSubjectsAndCards();

  if (isLoading)
    return (
      <Container>
        <LoadingSpinner />;
      </Container>
    );
  if (error)
    return (
      <Container>
        <ErrorDisplay message={error} />
      </Container>
    );

  return (
    <Container innerClassName="lg:px-7 bg-container">
      <SparkBoard subjects={["Teste", "Teste2", "Teste3", "Teste4"]} />
      <Dialog>
        <DialogTrigger asChild></DialogTrigger>
      </Dialog>
    </Container>
  );
}
