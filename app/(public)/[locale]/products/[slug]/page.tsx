export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <h1>Product: {slug}</h1>
      <p>Coming soon...</p>
    </div>
  );
}
