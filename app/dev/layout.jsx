import DevToolbar from "../components/DevToolbar";

export default function DevLayout({ children }) {
  return (
    <>
      {children}
      <DevToolbar />
    </>
  );
}