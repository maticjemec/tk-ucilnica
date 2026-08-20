import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type LessonTextContentProps = {
  heading: string;
  body: string;
  compact?: boolean;
};

export function LessonTextContent({
  heading,
  body,
  compact = false,
}: LessonTextContentProps) {
  return (
    <Card padding="none" className="px-5 py-6 sm:px-8 sm:py-8">
      <p className="ui-label">{compact ? "O lekciji" : "Besedilo lekcije"}</p>
      {compact ? null : (
        <h2 className="mt-2 font-serif text-[1.45rem] leading-snug font-medium tracking-tight text-foreground sm:text-[1.7rem]">
          {heading}
        </h2>
      )}
      <div
        className={cn(
          "max-w-[40rem] text-[1.02rem] leading-[1.75] text-foreground/90",
          compact ? "mt-3" : "mt-4 sm:mt-5",
        )}
      >
        {body.split(/\n+/).map((paragraph, index) => (
          <p key={`${index}-${paragraph.length}`} className="mt-4 first:mt-0">
            {paragraph}
          </p>
        ))}
      </div>
    </Card>
  );
}
