export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out will-change-transform">
      {children}
    </div>
  );
}