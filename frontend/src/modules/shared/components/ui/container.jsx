const Container = ({ children }) => {
  return (
    <main className="min-h-screen bg-background px-4 py-24 text-foreground sm:px-6 sm:py-24 md:px-12 md:py-16 lg:px-72 lg:py-24">
      {children}
    </main>
  );
};

export default Container;
