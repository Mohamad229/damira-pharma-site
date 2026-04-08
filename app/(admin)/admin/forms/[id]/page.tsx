export default async function FormDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1>Form Submission: {id}</h1>
      <p>Coming soon...</p>
    </div>
  );
}
