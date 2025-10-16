"use client";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div  className="flex items-center">
      {children}
    </div>
  );
}