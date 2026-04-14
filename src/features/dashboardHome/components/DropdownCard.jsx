import { useState } from "react";
import Button from "../../../components/ui/Button";

export default function DropdownCard({
  items,
  renderItem,
  maxItems = 4,
  emptyMessage = "Ingen data finns",
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!items || items.length === 0) {
    return <div className="text-sm text-slate-500">{emptyMessage}</div>;
  }

  const visibleItems = isExpanded ? items : items.slice(0, maxItems);
  const hasMore = items.length > maxItems;

  return (
    <div className="space-y-3 flex flex-col">
      {visibleItems.map(renderItem)}

      {hasMore && (
        <Button 
        variant="blue"
        onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Visa mindre" : `Visa alla (${items.length})`}
        </Button>
      )}
    </div>
  );
}
