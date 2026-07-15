export default function GradientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="gradient-blob absolute -left-40 -top-40 h-96 w-96 bg-accent" />
      <div className="gradient-blob absolute right-0 top-1/3 h-[28rem] w-[28rem] bg-accent-pink" />
      <div className="gradient-blob absolute bottom-0 left-1/3 h-80 w-80 bg-accent-light" />
    </div>
  );
}