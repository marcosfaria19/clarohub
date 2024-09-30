const Container = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen bg-background text-foreground ${className}`}>
      <div className="mx-auto w-full max-w-[1450px] px-4 py-28 sm:px-6 sm:py-16 md:px-8 md:py-16 lg:px-12 lg:py-24">
        {children}
      </div>
    </div>
  );
};

export default Container;
