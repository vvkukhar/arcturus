type Props = {
  message: string;
};

export function ErrorState({ message }: Props) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
      {message}
    </div>
  );
}