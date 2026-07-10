export default function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
}: {
  subtitle: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      <span className="text-sm font-semibold uppercase tracking-widest text-primary">
        {subtitle}
      </span>
      <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-muted">{description}</p>}
    </div>
  );
}
