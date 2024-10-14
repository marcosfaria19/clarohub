const Container = ({ children, className = "", innerClassName = "" }) => {
  return (
    <div
      className={`flex min-h-[calc(100vh-4rem)] flex-col bg-background text-foreground ${className}`}
    >
      <div
        className={`mx-auto w-full max-w-[1450px] flex-grow px-4 pt-28 sm:px-6 sm:pt-24 md:px-8 md:pt-12 lg:px-12 lg:pt-24 ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
