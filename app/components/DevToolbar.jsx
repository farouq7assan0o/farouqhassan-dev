"use client";

import Link from "next/link";

const pages = [
  { name: "Home", path: "/" },
  { name: "Edit", path: "/editorial" },
  { name: "Map", path: "/maproom" },
  { name: "Newr", path: "/newspaper" },
  { name: "Scroll", path: "/scroll" },
 // { name: "OS", path: "/os" },
  { name: "IR", path: "/incident" },
  { name: "merege", path: "/merged" },
];



export default function DevToolbar() {
  return (
    <div style={toolbar}>
      {pages.map((p) => (
        <Link key={p.path} href={p.path} style={link}>
          {p.name}
        </Link>
      ))}
    </div>
  );
}

const toolbar = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  background: "#111",
  padding: "10px 20px",
  display: "flex",
  gap: "16px",
  zIndex: 9999,
  fontSize: "14px",
};

const link = {
  color: "#0ff",
  textDecoration: "none",
};