type Props = {
 quantity?: number | null;
};
export function AvailabilityBadge({ quantity }: Props) {
 const available = (quantity ?? 0) > 0;
 return (
  <span
   className={
    available
     ? 'inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'
     : 'inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700'
   }
  >
   {available ? 'Available' : 'Sold'}
  </span>
 );
}