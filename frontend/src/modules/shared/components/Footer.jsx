const Footer = () => {
  return (
    <footer className="select-none bg-background p-5 text-foreground/80">
      <div className="container flex flex-wrap items-center justify-between">
        <p>&copy; Projetos Americana {new Date().getFullYear()}</p>
        <p>Desenvolvido por: Marcos Faria / Fares Nunes</p>
      </div>
    </footer>
  );
};

export default Footer;
