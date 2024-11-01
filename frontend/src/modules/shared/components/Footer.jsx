const Footer = () => {
  return (
    <footer className="select-none bg-menu p-5 text-foreground/80">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
          <p className="text-center text-sm sm:text-left md:text-base">
            &copy; Projetos Americana {new Date().getFullYear()}
          </p>
          <p className="text-center text-sm sm:text-right md:text-base">
            Desenvolvido por: Marcos Faria / Fares Nunes
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
