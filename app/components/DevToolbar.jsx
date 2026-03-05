"use client";

import Link from "next/link";

const pages = [
  { name: "Home", path: "/" },
  { name: "First", path: "/dev/first" },
  { name: "Edit", path: "/dev/editorial" },
  { name: "m2", path: "/dev/m2" },
  { name: "m3", path: "/dev/m3" },
  { name: "Map", path: "/dev/maproom" },
  { name: "Scroll", path: "/dev/scroll" },
  { name: "News", path: "/dev/newspaper" },
  { name: "IR", path: "/dev/incident" },
];

export default function DevToolbar() {

  // hide in production
  if (process.env.NODE_ENV === "production") return null;

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