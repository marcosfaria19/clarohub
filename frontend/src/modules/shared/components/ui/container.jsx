const Container = ({ children }) => {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 sm:py-10 md:px-12 md:py-12 lg:px-72 lg:py-12">
      {children}
    </main>
  );
};

export default Container;
