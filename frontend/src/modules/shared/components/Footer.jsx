const Footer = () => {
  return (
    <footer className="select-none bg-menu p-5 text-foreground/80">
      <div className="container mx-auto">
        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
          <p className="text-center sm:text-left">
            &copy; Projetos Americana {new Date().getFullYear()}
          </p>
          <p className="text-center sm:text-right">
            Desenvolvido por: Marcos Faria / Fares Nunes
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
