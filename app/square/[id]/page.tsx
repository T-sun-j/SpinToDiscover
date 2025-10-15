import SquareDetailClient from './SquareDetailClient';

interface SquareDetailPageProps {
  params: { id: string };
}

export default function SquareDetailPage({ params }: SquareDetailPageProps) {
  return <SquareDetailClient params={params} />;
}