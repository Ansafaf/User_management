const Loader = ({ message = "Loading...", inline = false }: { message?: string; inline?: boolean }) => {
  return (
    <div className={`loader-shell${inline ? " loader-shell--inline" : ""}`} aria-live="polite" aria-busy="true">
      <div className="loader-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};

export default Loader;
