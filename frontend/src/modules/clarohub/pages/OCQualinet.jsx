/* OCQualinet.jsx */

import UploadFile from "modules/clarohub/components/UploadFile";
import Container from "modules/shared/components/ui/container";

function OCQualinet() {
  return (
    <Container>
      <h2 className="mb-6 select-none text-3xl font-semibold text-foreground sm:mb-8 md:mb-10 lg:mb-12">
        OC Fácil
      </h2>
      <UploadFile />
    </Container>
  );
}
export default OCQualinet;
