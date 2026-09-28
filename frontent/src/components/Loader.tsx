const Loader = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="loader-shell" aria-live="polite" aria-busy="true">
      <div className="loader-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};

export default Loader;
