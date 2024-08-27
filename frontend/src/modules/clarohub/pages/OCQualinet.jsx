/* OCQualinet.jsx */

import UploadFile from "modules/clarohub/components/UploadFile";
import Container from "react-bootstrap/Container";
import "./OCQualinet.css";

function OCQualinet() {
  return (
    <Container className="ocqualinet-container" fluid>
      <h2 className="mb-5">OC Fácil</h2>
      <UploadFile />
    </Container>
  );
}
export default OCQualinet;
